"""Packs the vehicle models from the Vehicle-management-system lot (Motoriq's 3D
lot layout) into one GLB for the portfolio island.

    blender -b -P tools/blender/vehicles.py -- <src_dir> <out.glb>

Each model ends up under an empty named V_<key>. Meshes keep the lot's
"<part>|<material>" naming and material names, so the web scene assigns
materials the same way the lot engine does (paint is set per vehicle).
"""
import bpy
import os
import sys

ARGS = sys.argv[sys.argv.index("--") + 1:]
SRC, OUT = ARGS[0], ARGS[1]
KEYS = ["coupe", "hatchback", "sedan", "van", "mini_truck", "auto"]

bpy.ops.wm.read_factory_settings(use_empty=True)

for i, key in enumerate(KEYS):
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=os.path.join(SRC, f"{key}.glb"))
    new = [o for o in bpy.data.objects if o not in before]
    root = bpy.data.objects.new(f"V_{key}", None)
    bpy.context.collection.objects.link(root)
    for o in new:
        if o.parent is None:
            o.parent = root
    # spread them out so nothing overlaps in the file; the web scene places them
    root.location = (i * 8.0, 0, 0)

bpy.ops.export_scene.gltf(filepath=OUT, export_format="GLB", export_apply=True, export_yup=True,
                          export_animations=False, export_lights=False, export_cameras=False)
print("EXPORTED", OUT, os.path.getsize(OUT))
