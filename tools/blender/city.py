"""Builds the portfolio's 3D project city in Blender and exports it as a GLB.

Run headless:
    blender -b -P tools/blender/city.py -- <out_dir> [--render]

Everything is generated from code (no hand-placed assets), so the scene is
reproducible. Each project building is an empty named B_<key> whose children are
one joined static mesh plus a few separately named animated parts that the web
scene drives by name (see src/components/city/).
"""
import bpy
import bmesh
import math
import random
import sys
import os
from mathutils import Vector, Euler

ARGS = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
OUT = os.path.abspath(ARGS[0] if ARGS else ".")
RENDER = "--render" in ARGS
os.makedirs(OUT, exist_ok=True)
random.seed(7)

bpy.ops.wm.read_factory_settings(use_empty=True)
V = Vector


# ------------------------------------------------------------------ materials

def lin(h):
    h = h.lstrip("#")
    out = []
    for i in (0, 2, 4):
        c = int(h[i:i + 2], 16) / 255
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return out


MATS = {}


def mat(name, color, rough=0.75, metal=0.0, emit=None, strength=0.0, alpha=1.0):
    if name in MATS:
        return MATS[name]
    m = bpy.data.materials.new(name)
    try:
        m.use_nodes = True
    except Exception:
        pass
    b = m.node_tree.nodes.get("Principled BSDF")
    b.inputs["Base Color"].default_value = (*lin(color), 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    if emit:
        b.inputs["Emission Color"].default_value = (*lin(emit), 1)
        b.inputs["Emission Strength"].default_value = strength
    if alpha < 1:
        b.inputs["Alpha"].default_value = alpha
        try:
            m.surface_render_method = "BLENDED"
        except Exception:
            m.blend_method = "BLEND"
    MATS[name] = m
    return m


M = {
    "grass": mat("grass", "#1d3b2c", 0.95),
    "grass2": mat("grass_light", "#2a4d38", 0.95),
    "rock": mat("rock", "#3b322c", 0.95),
    "rock2": mat("rock_dark", "#2a2421", 0.95),
    "stone": mat("stone", "#77746d", 0.9),
    "stone2": mat("stone_dark", "#4d4b47", 0.9),
    "plot": mat("plot", "#34383e", 0.9),
    "asphalt": mat("asphalt", "#26292e", 0.95),
    "wall": mat("wall", "#cfc8bc", 0.85),
    "wall_white": mat("wall_white", "#e8ecef", 0.8),
    "wall_grey": mat("wall_grey", "#a9b0b8", 0.85),
    "dark": mat("dark", "#1b1e23", 0.6),
    "steel": mat("steel", "#9aa3ad", 0.35, 0.8),
    "metal_dark": mat("metal_dark", "#3a3f46", 0.4, 0.7),
    "roof": mat("roof", "#4a4f57", 0.8),
    "glass": mat("glass", "#a9c8ff", 0.05, 0.0, alpha=0.16),
    "glass_dark": mat("glass_dark", "#1f2a38", 0.15, 0.4),
    "trunk": mat("trunk", "#4b3526", 0.9),
    "leaf": mat("leaf", "#2f6b45", 0.9),
    "leaf2": mat("leaf_dark", "#24533a", 0.9),
    "leaf3": mat("leaf_teal", "#2f6f63", 0.9),
    "cardboard": mat("cardboard", "#b98a5a", 0.9),
    "tape": mat("tape", "#d9c39a", 0.7),
    "white": mat("paint_white", "#f2f2f0", 0.35, 0.1),
    "fabric_r": mat("fabric_red", "#c73a52", 0.95),
    "fabric_b": mat("fabric_blue", "#3466c2", 0.95),
    "fabric_y": mat("fabric_yellow", "#d8b23e", 0.95),
    "fabric_g": mat("fabric_green", "#3f9a6a", 0.95),
    "pallet": mat("pallet", "#8a6a45", 0.9),
    # emissive
    "win_warm": mat("win_warm", "#ffd9a0", 0.5, emit="#ffc070", strength=2.2),
    "win_cool": mat("win_cool", "#d8ecff", 0.5, emit="#bfe0ff", strength=2.0),
    "win_dim": mat("win_dim", "#6a7480", 0.5, emit="#8fa6c0", strength=0.5),
    "lamp": mat("lamp", "#fff1d0", 0.5, emit="#ffd28a", strength=8.0),
    "amber": mat("amber", "#f59e0b", 0.5, emit="#f59e0b", strength=5.0),
    "qc": mat("qc_green", "#22c55e", 0.5, emit="#22c55e", strength=7.0),
    "indigo": mat("indigo", "#6366f1", 0.5, emit="#6d70ff", strength=6.0),
    "cyan": mat("cyan", "#22d3ee", 0.5, emit="#22d3ee", strength=6.0),
    "pulse": mat("pulse_green", "#34d399", 0.5, emit="#34d399", strength=7.0),
    "red_light": mat("red_light", "#ef4444", 0.5, emit="#ff3030", strength=8.0),
    "blue_light": mat("blue_light", "#3b82f6", 0.5, emit="#3b82f6", strength=8.0),
    "water": mat("water", "#1b6f86", 0.1, emit="#2ec5e8", strength=0.9),
    "core": mat("core", "#ffffff", 0.2, emit="#e8f1ff", strength=6.0),
    "spot": mat("spot", "#ffffff", 0.3, emit="#ffffff", strength=4.0),
    "white_light": mat("white_light", "#ffffff", 0.3, emit="#f4f8ff", strength=4.0),
}


# ------------------------------------------------------------------ geometry helpers

PARTS = []


def take():
    global PARTS
    p, PARTS = PARTS, []
    return p


def _reg(o, m):
    o.data.materials.clear()
    o.data.materials.append(m)
    for p in o.data.polygons:
        p.use_smooth = False
    PARTS.append(o)
    return o


def _bevel(o, w):
    mod = o.modifiers.new("bevel", "BEVEL")
    mod.width = w
    mod.segments = 1
    mod.limit_method = "ANGLE"
    bpy.context.view_layer.objects.active = o
    bpy.ops.object.modifier_apply(modifier=mod.name)


def box(size, loc, m, rot=(0, 0, 0), bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    o = bpy.context.active_object
    o.scale = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel:
        _bevel(o, bevel)
    return _reg(o, m)


def cyl(r, depth, loc, m, verts=12, rot=(0, 0, 0), r2=None):
    if r2 is None:
        bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=depth, location=loc, rotation=rot)
    else:
        bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=r, radius2=r2, depth=depth, location=loc, rotation=rot)
    return _reg(bpy.context.active_object, m)


def ico(r, loc, m, sub=1, scale=(1, 1, 1)):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=sub, radius=r, location=loc)
    o = bpy.context.active_object
    o.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return _reg(o, m)


def torus(R, r, loc, m, seg=32, mseg=6, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, major_segments=seg,
                                     minor_segments=mseg, location=loc, rotation=rot)
    return _reg(bpy.context.active_object, m)


def strut(p1, p2, r, m, sides=6):
    p1, p2 = V(p1), V(p2)
    d = p2 - p1
    q = d.to_track_quat("Z", "Y")
    return cyl(r, d.length, (p1 + p2) / 2, m, verts=sides, rot=q.to_euler())


def bar(p1, p2, w, h, m):
    """Rectangular beam between two points (cross-section w x h)."""
    p1, p2 = V(p1), V(p2)
    d = p2 - p1
    o = box((w, h, d.length), (p1 + p2) / 2, m)
    o.rotation_euler = d.to_track_quat("Z", "Y").to_euler()
    return o


def poly_mesh(name, verts, faces, m):
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], faces)
    me.update()
    bm = bmesh.new()
    bm.from_mesh(me)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(o)
    return _reg(o, m)


def prism_yz(points, x0, x1, m, name="prism"):
    """Extrudes a convex 2D polygon in the YZ plane between x0 and x1."""
    n = len(points)
    verts = [(x0, y, z) for y, z in points] + [(x1, y, z) for y, z in points]
    faces = [list(range(n)), list(range(n, 2 * n))]
    for i in range(n):
        j = (i + 1) % n
        faces.append([i, j, n + j, n + i])
    return poly_mesh(name, verts, faces, m)


def prism_xz(points, y0, y1, m, name="prism"):
    """Extrudes a convex 2D polygon in the XZ plane between y0 and y1."""
    n = len(points)
    verts = [(x, y0, z) for x, z in points] + [(x, y1, z) for x, z in points]
    faces = [list(range(n))[::-1], list(range(n, 2 * n))]
    for i in range(n):
        j = (i + 1) % n
        faces.append([i, j, n + j, n + i])
    return poly_mesh(name, verts, faces, m)


def taper_box(size, loc, m, top=(0.7, 0.8), shift=0.0):
    """Box whose top face is scaled down (car cabins, roofs)."""
    sx, sy, sz = size
    x, y, z = loc
    hx, hy = sx / 2, sy / 2
    tx, ty = hx * top[0], hy * top[1]
    verts = [(x - hx, y - hy, z - sz / 2), (x + hx, y - hy, z - sz / 2), (x + hx, y + hy, z - sz / 2), (x - hx, y + hy, z - sz / 2),
             (x - tx + shift, y - ty, z + sz / 2), (x + tx + shift, y - ty, z + sz / 2), (x + tx + shift, y + ty, z + sz / 2), (x - tx + shift, y + ty, z + sz / 2)]
    faces = [[3, 2, 1, 0], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]]
    return poly_mesh("taper", verts, faces, m)


def join(objs, name):
    global PARTS
    objs = [o for o in objs if o is not None]
    ids = {id(o) for o in objs}
    PARTS = [p for p in PARTS if id(p) not in ids]
    bpy.ops.object.select_all(action="DESELECT")
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    if len(objs) > 1:
        bpy.ops.object.join()
    o = bpy.context.active_object
    o.name = name
    o.data.name = name
    return o


def origin_to(o, point):
    """Moves an object's origin to `point` without moving its geometry."""
    point = V(point)
    o.data.transform(__import__("mathutils").Matrix.Translation(-(point - o.location)))
    o.location = point


# ------------------------------------------------------------------ props

def slot(model, paint, loc, rot_deg=0.0, parent=None):
    """Placement marker for a vehicle from the Motoriq lot (public/models/vehicles.glb).
    The web scene reads model and paint from the name: slot_<model>_<rrggbb>."""
    e = bpy.data.objects.new(f"slot_{model}_{paint}", None)
    bpy.context.collection.objects.link(e)
    e.location = loc
    e.rotation_euler = (0, 0, math.radians(rot_deg))
    if parent is not None:
        bpy.context.view_layer.update()
        e.parent = parent
        e.matrix_parent_inverse = parent.matrix_world.inverted()
    return e


def pine(loc, h=1.0, m=None):
    x, y, z = loc
    m = m or M["leaf2"]
    cyl(0.07 * h, 0.4 * h, (x, y, z + 0.2 * h), M["trunk"], verts=6)
    cyl(0.55 * h, 0.9 * h, (x, y, z + 0.75 * h), m, verts=7, r2=0.0)
    cyl(0.42 * h, 0.75 * h, (x, y, z + 1.2 * h), m, verts=7, r2=0.0)
    cyl(0.28 * h, 0.6 * h, (x, y, z + 1.6 * h), m, verts=7, r2=0.0)


def round_tree(loc, h=1.0, m=None):
    x, y, z = loc
    m = m or M["leaf"]
    cyl(0.07 * h, 0.7 * h, (x, y, z + 0.35 * h), M["trunk"], verts=6)
    ico(0.5 * h, (x, y, z + 1.05 * h), m, sub=1, scale=(1, 1, 0.9))


def lamp(loc, h=1.4):
    x, y, z = loc
    cyl(0.04, h, (x, y, z + h / 2), M["metal_dark"], verts=6)
    box((0.22, 0.08, 0.04), (x, y, z + h), M["metal_dark"])
    ico(0.085, (x, y, z + h + 0.02), M["lamp"], sub=1)


def bush(loc, r=0.35, m=None):
    ico(r, (loc[0], loc[1], loc[2] + r * 0.5), m or M["leaf3"], sub=1, scale=(1, 1, 0.7))


# ------------------------------------------------------------------ buildings
# Local coordinates: front of each building faces +Y. Ground (plot top) is z=0.12.

G = 0.12


def plot(w, d):
    box((w, d, 0.12), (0, 0, 0.06), M["plot"], bevel=0.03)
    # kerb
    box((w + 0.12, d + 0.12, 0.06), (0, 0, 0.03), M["stone2"])


def b_erp():
    plot(7.4, 6.6)
    # main hall
    hx0, hx1, hy0, hy1, top = -3.2, 1.8, -2.6, 0.6, G + 1.9
    box((hx1 - hx0, hy1 - hy0, 1.9), ((hx0 + hx1) / 2, (hy0 + hy1) / 2, G + 0.95), M["wall"], bevel=0.03)
    box((hx1 - hx0 + 0.1, hy1 - hy0 + 0.1, 0.12), ((hx0 + hx1) / 2, (hy0 + hy1) / 2, top + 0.02), M["roof"])
    # sawtooth roof with glazed north lights
    teeth = 3
    w = (hy1 - hy0) / teeth
    for i in range(teeth):
        y0 = hy0 + i * w
        prism_yz([(y0, top + 0.08), (y0 + w, top + 0.08), (y0 + w, top + 0.78)], hx0 + 0.05, hx1 - 0.05, M["roof"])
        gw = hx1 - hx0 - 0.4
        box((gw, 0.03, 0.34), ((hx0 + hx1) / 2, y0 + w + 0.017, top + 0.42), M["win_warm"])
        for k in range(1, 10):
            box((0.05, 0.05, 0.36), (hx0 + 0.2 + k * gw / 10, y0 + w + 0.03, top + 0.42), M["roof"])
    # front windows + amber brand strip
    for i in range(6):
        box((0.42, 0.04, 0.5), (hx0 + 0.45 + i * 0.55, hy1 + 0.02, G + 1.05), M["win_warm"])
    box((hx1 - hx0, 0.05, 0.07), ((hx0 + hx1) / 2, hy1 + 0.03, top - 0.12), M["amber"])
    # loading door + canopy
    box((1.1, 0.05, 1.15), (1.05, hy1 + 0.02, G + 0.58), M["dark"])
    box((1.5, 0.6, 0.06), (1.05, hy1 + 0.3, G + 1.35), M["metal_dark"])
    ico(0.05, (1.05, hy1 + 0.55, G + 1.3), M["lamp"])
    # office annex
    ax, ay = 2.75, -1.5
    box((1.8, 2.2, 2.9), (ax, ay, G + 1.45), M["wall_grey"], bevel=0.03)
    box((1.9, 2.3, 0.1), (ax, ay, G + 2.95), M["roof"])
    for r in range(3):
        for c in range(2):
            box((0.5, 0.04, 0.45), (ax - 0.4 + c * 0.8, ay + 1.12, G + 0.75 + r * 0.8), M["win_cool"])
        box((0.04, 0.5, 0.45), (ax + 0.92, ay + 0.3, G + 0.75 + r * 0.8), M["win_cool"])
    # rooftop water tank
    tx, ty = -2.4, -1.8
    for dx in (-0.25, 0.25):
        for dy in (-0.25, 0.25):
            strut((tx + dx, ty + dy, top + 0.1), (tx + dx, ty + dy, top + 0.9), 0.03, M["metal_dark"])
    cyl(0.42, 0.6, (tx, ty, top + 1.2), M["steel"], verts=12)
    cyl(0.45, 0.12, (tx, ty, top + 1.56), M["metal_dark"], verts=12, r2=0.1)
    # extraction stacks
    for sx in (-0.6, 0.2):
        cyl(0.12, 0.9, (sx, -2.2, top + 0.5), M["steel"], verts=8)
    # conveyor along the front
    cy, cz = 1.85, G + 0.5
    box((6.6, 0.56, 0.08), (0, cy, cz), M["dark"])
    for side in (-0.3, 0.3):
        box((6.6, 0.05, 0.16), (0, cy + side, cz + 0.02), M["steel"])
    for i in range(8):
        lx = -3.1 + i * 0.885
        for side in (-0.25, 0.25):
            strut((lx, cy + side, G), (lx, cy + side, cz - 0.04), 0.025, M["metal_dark"])
    # QC gate
    qx = 0.6
    for side in (-0.42, 0.42):
        box((0.12, 0.12, 1.3), (qx, cy + side, G + 0.65), M["metal_dark"])
    box((0.16, 1.0, 0.14), (qx, cy, G + 1.32), M["metal_dark"])
    box((0.2, 1.0, 0.3), (qx + 0.0, cy, G + 1.55), M["white"])
    # fabric rolls stacked by the inward bay
    cols = [M["fabric_r"], M["fabric_b"], M["fabric_y"], M["fabric_g"], M["fabric_b"]]
    k = 0
    for row, n in enumerate((3, 2)):
        for i in range(n):
            cyl(0.18, 0.9, (-3.0 + i * 0.38 + row * 0.19, 2.75, G + 0.18 + row * 0.32), cols[k % len(cols)], verts=10, rot=(math.pi / 2, 0, 0))
            k += 1
    # dispatch pallets at the end of the line
    for i, (px, py) in enumerate(((2.1, 2.75), (1.25, 2.75))):
        box((0.75, 0.75, 0.12), (px, py, G + 0.06), M["pallet"])
        for j in range(3 if i == 0 else 2):
            box((0.32, 0.32, 0.26), (px - 0.17 + (j % 2) * 0.34, py + (-0.17 if j < 2 else 0.17), G + 0.27), M["cardboard"])
    # yard lamp + greenery
    lamp((-3.4, 0.9, G))
    bush((-3.3, -3.0, G), 0.3)
    bush((3.4, 0.3, G), 0.28)
    static = take()

    crates = []
    for i in range(5):
        cx = -3.0 + i * 1.3
        box((0.36, 0.36, 0.28), (cx, cy, cz + 0.18), M["cardboard"], bevel=0.015)
        box((0.37, 0.07, 0.29), (cx, cy, cz + 0.18), M["tape"])
        o = join(take(), f"erp_crate_{i}")
        origin_to(o, (cx, cy, cz + 0.04))
        crates.append(o)
    box((0.08, 0.84, 0.05), (qx, cy, G + 1.22), M["qc"])
    qc = join(take(), "erp_qc_light")
    # dispatch truck backed up to the pallets, nose out
    truck = slot("mini_truck", "e8e6df", (3.05, 3.2, G), 90)
    return static, crates + [qc, truck]


def b_motoriq():
    plot(6.8, 6.6)
    box((6.0, 1.7, 0.03), (0, 2.25, G + 0.015), M["asphalt"])
    # plinth + glass box
    by = -0.5
    box((5.6, 4.4, 0.26), (0, by, G + 0.13), M["dark"], bevel=0.04)
    fz = G + 0.26
    box((5.1, 3.9, 0.03), (0, by, fz + 0.015), M["white"])
    H = 2.3
    # mullions
    for x in (-2.5, -1.25, 0, 1.25, 2.5):
        for y in (by - 1.9, by + 1.9):
            box((0.06, 0.06, H), (x, y, fz + H / 2), M["metal_dark"])
    for y in (by - 0.95, by, by + 0.95):
        for x in (-2.5, 2.5):
            box((0.06, 0.06, H), (x, y, fz + H / 2), M["metal_dark"])
    # roof + indigo crown
    rz = fz + H + 0.1
    box((5.9, 4.7, 0.2), (0, by, rz), M["dark"], bevel=0.03)
    box((5.92, 0.05, 0.08), (0, by + 2.36, rz - 0.02), M["indigo"])
    box((5.92, 0.05, 0.08), (0, by - 2.36, rz - 0.02), M["indigo"])
    box((0.05, 4.72, 0.08), (2.96, by, rz - 0.02), M["indigo"])
    box((0.05, 4.72, 0.08), (-2.96, by, rz - 0.02), M["indigo"])
    for x in (-1.2, 0, 1.2):
        cyl(0.18, 0.03, (x, by, rz - 0.115), M["spot"], verts=10)
    # interior props: desk + display
    box((0.9, 0.45, 0.5), (-1.8, by - 1.3, fz + 0.25), M["white"])
    box((0.5, 0.04, 0.32), (-1.8, by - 1.3, fz + 0.72), M["indigo"])
    # pylon sign
    box((0.4, 0.16, 2.4), (-2.85, 2.3, G + 1.2), M["dark"], bevel=0.03)
    box((0.3, 0.02, 1.9), (-2.85, 2.39, G + 1.3), M["indigo"])
    lamp((3.0, 1.2, G))
    lamp((-3.0, -2.8, G))
    bush((3.0, -2.9, G), 0.3)
    static = take()

    cyl(1.35, 0.08, (0, by, fz + 0.07), M["white"], verts=32)
    torus(1.35, 0.03, (0, by, fz + 0.1), M["indigo"], seg=40, mseg=4)
    tt = join(take(), "miq_turntable")
    origin_to(tt, (0, by, fz + 0.1))
    show = slot("coupe", "d8333f", (0, by, fz + 0.11), 0, parent=tt)
    parked = [slot("hatchback", "2f5bd3", (1.45, 2.25, G), 8), slot("sedan", "e6e8ec", (-1.0, 2.2, G), -5)]
    # transparent glass last so it sorts after the interior
    gl = box((5.0, 3.8, H), (0, by, fz + H / 2), M["glass"])
    PARTS.remove(gl)
    gl.name = "miq_glass"
    return static, [tt, gl, show] + parked


def b_pravak():
    plot(6.6, 6.6)
    # control room
    cx, cy = -1.4, 0.9
    box((2.8, 2.0, 1.5), (cx, cy, G + 0.75), M["wall_grey"], bevel=0.03)
    box((3.0, 2.2, 0.12), (cx, cy, G + 1.56), M["roof"])
    box((2.2, 0.04, 0.4), (cx - 0.1, cy + 1.02, G + 1.0), M["win_cool"])
    box((0.5, 0.04, 0.9), (cx + 0.95, cy + 1.02, G + 0.45), M["dark"])
    box((2.82, 0.05, 0.06), (cx, cy + 1.03, G + 1.42), M["cyan"])
    # roof dish
    cyl(0.5, 0.18, (cx - 0.6, cy - 0.2, G + 1.85), M["white"], verts=16, r2=0.12, rot=(math.radians(-35), 0, math.radians(20)))
    strut((cx - 0.6, cy - 0.2, G + 1.62), (cx - 0.6, cy - 0.2, G + 1.8), 0.04, M["metal_dark"])
    # lattice tower
    tx, ty = 1.4, -1.0
    H = 7.6
    a0, a1 = 0.85, 0.2

    def corner(z, sx, sy):
        t = z / H
        a = a0 + (a1 - a0) * t
        return V((tx + sx * a, ty + sy * a, G + z))
    corners = [(-1, -1), (1, -1), (1, 1), (-1, 1)]
    for sx, sy in corners:
        strut(corner(0, sx, sy), corner(H, sx, sy), 0.055, M["steel"])
    levels = [0.0, 1.2, 2.3, 3.3, 4.2, 5.0, 5.8, 6.6, H]
    for zi, z in enumerate(levels):
        pts = [corner(z, sx, sy) for sx, sy in corners]
        for i in range(4):
            strut(pts[i], pts[(i + 1) % 4], 0.03, M["steel"])
        if zi + 1 < len(levels):
            z2 = levels[zi + 1]
            up = [corner(z2, sx, sy) for sx, sy in corners]
            for i in range(4):
                strut(pts[i], up[(i + 1) % 4], 0.022, M["steel"])
    # platforms + dishes
    for z in (4.2, 6.6):
        a = a0 + (a1 - a0) * (z / H) + 0.25
        box((a * 2, a * 2, 0.05), (tx, ty, G + z), M["metal_dark"])
    for ang, z in ((0, 4.6), (math.radians(110), 5.2), (math.radians(220), 4.4)):
        d = V((math.cos(ang), math.sin(ang), 0))
        p = V((tx, ty, G + z)) + d * 0.65
        cyl(0.36, 0.14, p, M["white"], verts=14, r2=0.06, rot=d.to_track_quat("-Z", "Y").to_euler())
    # mast
    strut((tx, ty, G + H), (tx, ty, G + H + 1.0), 0.04, M["steel"])
    # fence
    f = 1.5
    pts = [(tx - f, ty - f), (tx + f, ty - f), (tx + f, ty + f), (tx - f, ty + f)]
    for i in range(4):
        p1, p2 = V((*pts[i], 0)), V((*pts[(i + 1) % 4], 0))
        n = 6
        for k in range(n):
            q = p1.lerp(p2, k / n)
            strut((q.x, q.y, G), (q.x, q.y, G + 0.55), 0.02, M["metal_dark"], sides=4)
        for hz in (0.25, 0.5):
            strut((p1.x, p1.y, G + hz), (p2.x, p2.y, G + hz), 0.012, M["metal_dark"], sides=4)
    lamp((-2.9, 2.6, G))
    pine((-2.7, -2.4, G), 0.9)
    pine((-1.6, -2.7, G), 0.75)
    bush((2.9, 2.6, G), 0.3)
    static = take()

    anim = []
    ico(0.13, (tx, ty, G + H + 1.08), M["red_light"], sub=1)
    beacon = join(take(), "prv_beacon")
    origin_to(beacon, (tx, ty, G + H + 1.08))
    anim.append(beacon)
    for i in range(3):
        torus(0.5, 0.022, (tx, ty, G + H + 0.6), M["cyan"], seg=48, mseg=4)
        r = join(take(), f"prv_ring_{i}")
        origin_to(r, (tx, ty, G + H + 0.6))
        anim.append(r)
    return static, anim


def b_medbot():
    plot(7.0, 6.6)
    box((5.6, 1.8, 0.03), (0, 2.3, G + 0.015), M["asphalt"])
    # main block
    mx0, mx1, my0, my1, H = -2.3, 2.3, -2.5, 0.5, 2.5
    box((mx1 - mx0, my1 - my0, H), (0, (my0 + my1) / 2, G + H / 2), M["wall_white"], bevel=0.03)
    box((mx1 - mx0 + 0.14, my1 - my0 + 0.14, 0.12), (0, (my0 + my1) / 2, G + H + 0.05), M["roof"])
    box((mx1 - mx0 + 0.02, 0.05, 0.12), (0, my1 + 0.02, G + 1.3), M["wall_grey"])
    for fl in range(2):
        for i in range(5):
            x = mx0 + 0.55 + i * 0.88
            if fl == 0 and abs(x) < 0.6:
                continue
            box((0.55, 0.04, 0.55), (x, my1 + 0.02, G + 0.7 + fl * 1.15), M["win_cool"] if (i + fl) % 3 else M["win_warm"])
    # side wing
    box((1.6, 2.2, 1.5), (-3.0 + 0.05, -1.2, G + 0.75), M["wall_grey"], bevel=0.03)
    box((1.7, 2.3, 0.1), (-2.95, -1.2, G + 1.55), M["roof"])
    box((0.04, 1.4, 0.4), (-3.77, -1.2, G + 0.9), M["win_warm"])
    # entrance canopy + glass doors
    box((1.9, 1.1, 0.08), (0, my1 + 0.55, G + 1.12), M["white"])
    for x in (-0.85, 0.85):
        box((0.06, 0.06, 1.08), (x, my1 + 1.0, G + 0.56), M["steel"])
    box((1.0, 0.04, 0.9), (0, my1 + 0.02, G + 0.45), M["win_warm"])
    box((1.92, 0.04, 0.05), (0, my1 + 1.11, G + 1.12), M["pulse"])
    # green cross on facade
    box((0.5, 0.05, 0.15), (1.75, my1 + 0.03, G + 2.1), M["pulse"])
    box((0.15, 0.05, 0.5), (1.75, my1 + 0.03, G + 2.1), M["pulse"])
    # rooftop sign frame
    sz = G + H + 0.75
    for x in (-1.0, 1.0):
        strut((x, -0.3, G + H + 0.1), (x, -0.3, sz - 0.4), 0.035, M["metal_dark"])
    box((2.4, 0.1, 0.9), (0, -0.3, sz), M["dark"], bevel=0.02)
    # rooftop AC units
    for x in (-1.5, 1.6):
        box((0.6, 0.5, 0.35), (x, -1.8, G + H + 0.28), M["steel"])
    # ambulance: the lot's van, white, with a light bar
    ax, ay = 1.7, 2.3
    lamp((-3.1, 1.4, G))
    round_tree((-2.6, 2.6, G), 0.9)
    round_tree((3.0, -2.6, G), 0.8)
    bush((-1.2, 1.3, G), 0.28)
    bush((1.2, 1.3, G), 0.28)
    static = take()

    # heartbeat line on the sign
    pts = [(-0.95, 0), (-0.4, 0), (-0.28, 0.18), (-0.14, -0.3), (0.02, 0.32), (0.16, -0.12), (0.26, 0), (0.95, 0)]
    for py in (-0.22, -0.38):  # both faces: readable from the street and the plaza
        for (x1, z1), (x2, z2) in zip(pts, pts[1:]):
            bar((x1, py, sz + z1), (x2, py, sz + z2), 0.05, 0.05, M["pulse"])
            ico(0.035, (x2, py, sz + z2), M["pulse"], sub=1)
    heart = join(take(), "med_heart")
    origin_to(heart, (0, -0.3, sz))
    roof = G + 0.83
    box((0.16, 0.12, 0.07), (ax - 0.1, ay - 0.13, roof), M["red_light"])
    sr = join(take(), "med_siren_r")
    box((0.16, 0.12, 0.07), (ax - 0.1, ay + 0.13, roof), M["blue_light"])
    sb = join(take(), "med_siren_b")
    van = slot("van", "f4f5f2", (ax, ay, G), 0)
    return static, [heart, sr, sb, van]


def b_ladders():
    plot(6.2, 6.2)
    # podium
    box((4.6, 4.6, 1.1), (0, -0.2, G + 0.55), M["glass_dark"], bevel=0.03)
    box((4.62, 4.62, 0.12), (0, -0.2, G + 0.85), M["win_warm"])
    box((4.8, 4.8, 0.1), (0, -0.2, G + 1.15), M["dark"])
    tiers = [(3.0, 1.2, 4.6), (2.4, 5.8, 2.6), (1.7, 8.4, 1.4)]
    for w, z0, h in tiers:
        box((w, w, h), (0, -0.2, G + z0 + h / 2), M["glass_dark"])
        box((w + 0.12, w + 0.12, 0.1), (0, -0.2, G + z0 + h), M["dark"])
        # floor bands (some floors dark)
        n = int(h / 0.45)
        for i in range(n):
            z = G + z0 + 0.25 + i * 0.45
            r = random.random()
            m = M["win_cool"] if r < 0.55 else (M["win_warm"] if r < 0.75 else M["win_dim"])
            box((w + 0.025, w + 0.025, 0.2), (0, -0.2, z), m)
        # mullions
        for k in range(5):
            o = -w / 2 + k * w / 4
            for (px, py) in ((o, -0.2 - w / 2), (o, -0.2 + w / 2), (-w / 2, -0.2 + o), (w / 2, -0.2 + o)):
                box((0.05, 0.05, h), (px, py, G + z0 + h / 2), M["metal_dark"])
    top = G + 9.8
    # crown + helipad + antenna
    box((1.72, 1.72, 0.06), (0, -0.2, top + 0.03), M["white_light"])
    cyl(0.55, 0.05, (0, -0.2, top + 0.09), M["stone"], verts=16)
    strut((0.6, 0.35, top), (0.6, 0.35, top + 1.4), 0.03, M["steel"])
    # entrance
    box((1.2, 0.04, 0.8), (0, 2.12, G + 0.45), M["win_warm"])
    box((1.6, 0.7, 0.06), (0, 2.4, G + 1.0), M["dark"])
    lamp((-2.6, 2.6, G))
    lamp((2.6, 2.6, G))
    pine((-2.6, -2.6, G), 0.8)
    pine((2.6, -2.7, G), 0.9)
    static = take()

    cars = [slot("sedan", "9aa3ad", (-1.55, 2.78, G), 0), slot("hatchback", "f2b33d", (1.6, 2.78, G), 180)]
    ico(0.09, (0.6, 0.35, top + 1.45), M["red_light"], sub=1)
    beacon = join(take(), "lad_beacon")
    origin_to(beacon, (0.6, 0.35, top + 1.45))
    return static, [beacon] + cars


# ------------------------------------------------------------------ island

def lathe(rings, verts, m, name, jitter=0.07, zj=0.25):
    """Rock body from rings of (radius, z), last ring collapses to a point."""
    bm = bmesh.new()
    layers = []
    for ri, (r, z) in enumerate(rings):
        if r <= 0.001:
            layers.append([bm.verts.new((0, 0, z))])
            continue
        ring = []
        for i in range(verts):
            a = i / verts * math.tau
            rr = r * (1 + random.uniform(-jitter, jitter)) if ri > 0 else r
            zz = z + (random.uniform(-zj, zj) if ri > 0 else 0)
            ring.append(bm.verts.new((math.cos(a) * rr, math.sin(a) * rr, zz)))
        layers.append(ring)
    for a, b in zip(layers, layers[1:]):
        for i in range(verts):
            j = (i + 1) % verts
            if len(b) == 1:
                bm.faces.new((a[i], a[j], b[0]))
            else:
                bm.faces.new((a[i], a[j], b[j], b[i]))
    bm.faces.new(layers[0])
    me = bpy.data.meshes.new(name)
    bm.normal_update()
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(o)
    return _reg(o, m)


R_ISLAND = 15.5
R_BUILD = 9.2
BUILDINGS = [
    ("erp", -90, b_erp),
    ("motoriq", -18, b_motoriq),
    ("pravak", 54, b_pravak),
    ("medbot", 126, b_medbot),
    ("ladders", 198, b_ladders),
]


def annulus(r0, r1, z, m, n=64):
    """Flat ring road around the island."""
    verts, faces = [], []
    for i in range(n):
        a = i / n * math.tau
        verts += [(math.cos(a) * r0, math.sin(a) * r0, z), (math.cos(a) * r1, math.sin(a) * r1, z)]
    for i in range(n):
        j = (i + 1) % n
        faces.append([2 * i, 2 * i + 1, 2 * j + 1, 2 * j])
    o = poly_mesh("road", verts, faces, m)
    # recalc_face_normals has no inside/outside to go by on a flat open ring
    if o.data.polygons[0].normal.z < 0:
        o.data.flip_normals()
    # dashed centre line
    for i in range(0, n, 2):
        a = (i + 0.5) / n * math.tau
        box((0.06, 0.32, 0.01), (math.cos(a) * (r0 + r1) / 2, math.sin(a) * (r0 + r1) / 2, z + 0.006), M["stone"], rot=(0, 0, a))
    return o


def island():
    n = 56
    # grass cap: irregular disc with a little thickness
    bm = bmesh.new()
    top, bot = [], []
    radii = []
    for i in range(n):
        a = i / n * math.tau
        r = R_ISLAND * (1 + 0.035 * math.sin(a * 3 + 0.7) + random.uniform(-0.02, 0.02))
        radii.append(r)
        top.append(bm.verts.new((math.cos(a) * r, math.sin(a) * r, 0)))
        bot.append(bm.verts.new((math.cos(a) * r * 1.01, math.sin(a) * r * 1.01, -0.45)))
    bm.faces.new(top)
    for i in range(n):
        j = (i + 1) % n
        bm.faces.new((top[j], top[i], bot[i], bot[j]))
    bm.faces.new(list(reversed(bot)))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new("grass")
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new("grass", me)
    bpy.context.collection.objects.link(o)
    _reg(o, M["grass"])
    # dirt band then rock body
    lathe([(R_ISLAND * 1.01, -0.45), (R_ISLAND * 0.99, -1.2)], n, M["rock"], "dirt", jitter=0.02, zj=0.1)
    lathe([(R_ISLAND * 0.99, -1.2), (14.2, -2.4), (12.2, -3.9), (9.6, -5.4), (6.8, -7.2), (4.0, -9.0), (1.6, -10.8), (0, -12.2)],
          n, M["rock2"], "rock", jitter=0.09, zj=0.35)
    # hanging stalactites
    for _ in range(14):
        a = random.uniform(0, math.tau)
        r = random.uniform(3, 11)
        z = -2.5 - (11 - r) * 0.7
        h = random.uniform(1.2, 3.0)
        cyl(random.uniform(0.6, 1.3), h, (math.cos(a) * r, math.sin(a) * r, z - h / 2), M["rock2"], verts=6, r2=0.05, rot=(math.pi, 0, 0))

    # plaza + fountain
    cyl(3.2, 0.06, (0, 0, 0.03), M["stone"], verts=40)
    torus(3.2, 0.08, (0, 0, 0.06), M["stone2"], seg=40, mseg=4)
    cyl(1.25, 0.4, (0, 0, 0.2), M["stone2"], verts=20)
    cyl(1.08, 0.04, (0, 0, 0.36), M["water"], verts=20)
    cyl(0.25, 0.9, (0, 0, 0.55), M["stone"], verts=10)
    cyl(0.55, 0.08, (0, 0, 1.0), M["stone2"], verts=12)
    # paths + lamps to each building
    for key, deg, _ in BUILDINGS:
        a = math.radians(deg)
        d = V((math.cos(a), math.sin(a), 0))
        r0, r1 = 3.1, R_BUILD - 3.2
        mid = d * (r0 + r1) / 2
        box((1.3, r1 - r0, 0.05), (mid.x, mid.y, 0.025), M["stone"], rot=(0, 0, a - math.pi / 2))
        side = V((-d.y, d.x, 0))
        for t in (0.35, 0.9):
            p = d * (r0 + (r1 - r0) * t) + side * 0.9
            lamp((p.x, p.y, 0.0), 1.3)
    # outer ring path
    annulus(12.4, 13.4, 0.02, M["asphalt"], 120)
    # scatter trees, bushes and rocks, keeping clear of plots and paths
    plots = [V((math.cos(math.radians(d)) * R_BUILD, math.sin(math.radians(d)) * R_BUILD, 0)) for _, d, _ in BUILDINGS]
    placed = []

    def clear(p, rad):
        if p.length < 3.8:
            return False
        for c in plots:
            if (p - c).length < 4.9 + rad:
                return False
        for _, deg, _ in BUILDINGS:
            a = math.radians(deg)
            d = V((math.cos(a), math.sin(a), 0))
            along = p.dot(d)
            if 2.5 < along < R_BUILD and (p - d * along).length < 1.3:
                return False
        if 12.3 < p.length < 13.5:
            return False
        for q in placed:
            if (p - q).length < 0.9:
                return False
        return True
    tries = 0
    count = 0
    while count < 95 and tries < 3000:
        tries += 1
        a = random.uniform(0, math.tau)
        r = math.sqrt(random.uniform(3.8 ** 2, 14.7 ** 2))
        p = V((math.cos(a) * r, math.sin(a) * r, 0))
        if not clear(p, 0.0):
            continue
        placed.append(p)
        count += 1
        k = random.random()
        h = random.uniform(0.75, 1.25)
        if k < 0.45:
            pine((p.x, p.y, 0), h, random.choice([M["leaf2"], M["leaf"]]))
        elif k < 0.75:
            round_tree((p.x, p.y, 0), h, random.choice([M["leaf"], M["leaf3"]]))
        elif k < 0.9:
            bush((p.x, p.y, 0), random.uniform(0.25, 0.4))
        else:
            ico(random.uniform(0.25, 0.5), (p.x, p.y, 0.05), M["stone2"], sub=1, scale=(1, 0.8, 0.6))
    static = take()

    anim = []
    for i in range(7):
        a = i / 7 * math.tau + random.uniform(-0.2, 0.2)
        r = random.uniform(18, 22)
        z = random.uniform(-3.5, 1.0)
        s = random.uniform(0.5, 1.1)
        p = (math.cos(a) * r, math.sin(a) * r, z)
        ico(s, p, M["rock2"], sub=1, scale=(1, 1, 0.7))
        cyl(s * 0.95, s * 0.12, (p[0], p[1], p[2] + s * 0.66), M["grass"], verts=8)
        if random.random() < 0.6:
            pine((p[0], p[1], p[2] + s * 0.72), 0.45)
        o = join(take(), f"rock_float_{i}")
        origin_to(o, p)
        anim.append(o)
    ico(0.32, (0, 0, 1.75), M["core"], sub=0)
    core = join(take(), "plaza_core")
    origin_to(core, (0, 0, 1.75))
    anim.append(core)
    return static, anim


# ------------------------------------------------------------------ assemble

def finish(name, static, anim, loc=(0, 0, 0), rot_z=0.0):
    root = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(root)
    s = join(static, name + "_static")
    s.parent = root
    for a in anim:
        if a.parent is None:
            a.parent = root
    root.location = loc
    root.rotation_euler = (0, 0, rot_z)
    return root


st, an = island()
finish("ISLAND", st, an)
for key, deg, fn in BUILDINGS:
    a = math.radians(deg)
    st, an = fn()
    finish("B_" + key, st, an, (math.cos(a) * R_BUILD, math.sin(a) * R_BUILD, 0), a - math.pi / 2)

bpy.context.view_layer.update()
glb = os.path.join(OUT, "city.glb")
bpy.ops.object.select_all(action="DESELECT")
bpy.ops.export_scene.gltf(filepath=glb, export_format="GLB", export_apply=True,
                          export_yup=True, export_animations=False, export_lights=False,
                          export_cameras=False)
print("EXPORTED", glb, os.path.getsize(glb))
tris = sum(len(o.data.loop_triangles) if (o.data.calc_loop_triangles() or True) else 0
           for o in bpy.data.objects if o.type == "MESH")
print("TRIANGLES", tris, "OBJECTS", len([o for o in bpy.data.objects if o.type == "MESH"]))


# ------------------------------------------------------------------ preview renders

def render(path, cam_loc, target, lens=35, res=(1600, 1000)):
    scn = bpy.context.scene
    cam = bpy.data.objects.get("CAM")
    if cam is None:
        cam = bpy.data.objects.new("CAM", bpy.data.cameras.new("CAM"))
        scn.collection.objects.link(cam)
        scn.camera = cam
    cam.location = cam_loc
    cam.data.lens = lens
    d = V(target) - V(cam_loc)
    cam.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    scn.render.resolution_x, scn.render.resolution_y = res
    scn.render.filepath = path
    bpy.ops.render.render(write_still=True)


if RENDER:
    scn = bpy.context.scene
    for eng in ("BLENDER_EEVEE", "BLENDER_EEVEE_NEXT"):
        try:
            scn.render.engine = eng
            break
        except TypeError:
            continue
    try:
        scn.view_settings.view_transform = "AgX"
    except Exception:
        pass
    w = bpy.data.worlds.new("night")
    try:
        w.use_nodes = True
    except Exception:
        pass
    w.node_tree.nodes["Background"].inputs[0].default_value = (*lin("#0b1020"), 1)
    w.node_tree.nodes["Background"].inputs[1].default_value = 0.6
    scn.world = w
    sun = bpy.data.objects.new("moon", bpy.data.lights.new("moon", "SUN"))
    sun.data.energy = 1.6
    sun.data.color = lin("#b9c8ff")
    sun.rotation_euler = Euler((math.radians(50), 0, math.radians(-35)))
    scn.collection.objects.link(sun)
    fill = bpy.data.objects.new("fill", bpy.data.lights.new("fill", "SUN"))
    fill.data.energy = 0.4
    fill.data.color = lin("#ffb98a")
    fill.rotation_euler = Euler((math.radians(70), 0, math.radians(150)))
    scn.collection.objects.link(fill)
    render(os.path.join(OUT, "preview_overview.png"), (0, -34, 20), (0, 0, -1.5), lens=32)
    for key, deg, _ in BUILDINGS:
        a = math.radians(deg)
        c = V((math.cos(a), math.sin(a), 0))
        side = V((-c.y, c.x, 0))
        cam = c * (R_BUILD + 9.5) + side * 3.5 + V((0, 0, 4.5))
        tgt = c * R_BUILD + V((0, 0, 1.6 if key != "ladders" and key != "pravak" else 3.5))
        render(os.path.join(OUT, f"preview_{key}.png"), cam, tgt, lens=40)
