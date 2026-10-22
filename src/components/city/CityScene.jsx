/* eslint-disable react-hooks/immutability -- three.js objects are mutated imperatively, per frame, as usual in R3F */
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { CameraControls, Html, Stars, useGLTF, PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { projects } from "../../data/projects.js";
import { VEHICLES_URL, createVehicleFactory, parseSlot } from "./vehicles.js";

export const MODEL_URL = "/models/city.glb";

// Renders as the hero's #0a0a0a. ACES tone mapping crushes near-black, so the
// input has to be a touch lighter for the output to match (measured on screen).
const BG = "#1c1c1c";
const OVERVIEW = { cam: [0, 23, 43], target: [0, 0.6, 0] };
// Per-building framing: look-at height and camera distance.
const FRAMING = {
  erp: { h: 1.6, d: 15 },
  motoriq: { h: 1.4, d: 14 },
  pravak: { h: 4.4, d: 19.5 },
  medbot: { h: 1.9, d: 15 },
  ladders: { h: 5.4, d: 23 },
};

const UP = new THREE.Vector3(0, 1, 0);

// Picking uses the real geometry, so whatever is visibly in front wins. Open
// lattice parts (the radio tower is mostly air) get an invisible box so a click
// on the tower doesn't fall through its gaps.
const HIT_MAT = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false });
const LATTICE = new Set(["steel"]);

function latticeVolumes(node, key) {
  const toLocal = node.matrixWorld.clone().invert();
  const quat = node.getWorldQuaternion(new THREE.Quaternion());
  const out = [];
  node.traverse((o) => {
    if (!o.isMesh || !LATTICE.has(o.material.name)) return;
    o.geometry.computeBoundingBox();
    const box = o.geometry.boundingBox.clone().applyMatrix4(toLocal.clone().multiply(o.matrixWorld));
    const size = box.getSize(new THREE.Vector3());
    const hit = new THREE.Mesh(new THREE.BoxGeometry(size.x, size.y, size.z), HIT_MAT);
    hit.position.copy(box.getCenter(new THREE.Vector3()).applyMatrix4(node.matrixWorld));
    hit.quaternion.copy(quat);
    hit.userData.key = key;
    out.push(hit);
  });
  return out;
}

// Emission as authored in Blender is tuned for Eevee; these factors bring it in
// line with the bloom threshold here so windows glow without blowing out.
const EMISSIVE_SCALE = {
  win_warm: 0.5,
  win_cool: 0.42,
  win_dim: 0.6,
  lamp: 0.75,
  amber: 0.6,
  indigo: 0.32,
  cyan: 0.7,
  pulse: 0.8,
  white_light: 0.45,
  spot: 0.6,
  core: 0.6,
};

// meshopt quantization stores a dequantization transform on each mesh node, so
// animated parts are never transformed directly. Each one is wrapped in a group
// centred on its bounding box, and the group is what gets animated.
function pivot(node) {
  if (!node) return null;
  const parent = node.parent;
  const center = new THREE.Box3().setFromObject(node).getCenter(new THREE.Vector3());
  const local = parent.worldToLocal(center);
  const g = new THREE.Group();
  g.name = `${node.name}_pivot`;
  g.position.copy(local);
  parent.add(g);
  g.updateMatrixWorld(true);
  g.attach(node);
  g.userData.base = local.clone();
  return g;
}

// Collects and clones the materials under an object so it can be animated
// without affecting other meshes that share the same material.
function ownMaterials(obj) {
  const out = [];
  obj.traverse((o) => {
    if (o.isMesh) {
      o.material = o.material.clone();
      out.push(o.material);
    }
  });
  return out;
}

// Two vehicles circling the ring road: [model, paint, lane radius, speed (rad/s)].
// Each has its own lane, 0.8 apart. The widest car is about 0.92 across, so
// two half-widths (0.46 + 0.35) fit between lane centres and they never touch.
const TRAFFIC = [
  ["auto", "#f5c518", 13.45, 0.11],
  ["hatchback", "#e0e4ea", 14.25, -0.085],
];
const ROAD_Y = 0.025;

function useCity(lowPower) {
  const { scene } = useGLTF(MODEL_URL, false, true);
  const { scene: vehiclesScene } = useGLTF(VEHICLES_URL, false, true);
  const gl = useThree((st) => st.gl);
  return useMemo(() => {
    const root = scene.clone(true);
    const makeVehicle = createVehicleFactory(vehiclesScene, gl);
    root.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = !lowPower;
      o.receiveShadow = !lowPower;
      const m = o.material;
      if (!m.userData.tuned) {
        m.userData.tuned = true;
        const k = EMISSIVE_SCALE[m.name];
        if (k) m.emissiveIntensity *= k;
      }
      if (m.transparent || m.opacity < 1) {
        m.transparent = true;
        m.depthWrite = false;
        o.renderOrder = 2;
        o.castShadow = false;
      }
    });

    const get = (name) => root.getObjectByName(name);
    const noShadow = (o) => o && o.traverse((c) => { c.castShadow = false; });

    // Park a lot vehicle on every slot marker from Blender.
    const slots = [];
    root.traverse((o) => { if (o.name.startsWith("slot_")) slots.push(o); });
    for (const sl of slots) {
      const { model, hex } = parseSlot(sl.name) || {};
      const v = model && makeVehicle(model, hex, { shadows: !lowPower });
      if (v) sl.add(v);
    }
    root.updateMatrixWorld(true);

    const traffic = new THREE.Group();
    const drivers = TRAFFIC.map(([model, hex, r, speed], i) => {
      const v = makeVehicle(model, hex, { shadows: false });
      if (!v) return null;
      traffic.add(v);
      return { v, r, speed, a: i * Math.PI };
    }).filter(Boolean);

    const buildings = {};
    for (const p of projects) {
      const node = get(`B_${p.key}`);
      if (!node) continue;
      const pos = node.position.clone();
      const out = new THREE.Vector3(pos.x, 0, pos.z).normalize();
      const side = new THREE.Vector3(-out.z, 0, out.x);
      const f = FRAMING[p.key];
      const target = pos.clone().addScaledVector(UP, f.h);
      const cam = pos.clone()
        .addScaledVector(out, f.d)
        .addScaledVector(side, f.d * 0.38)
        .addScaledVector(UP, f.h + f.d * 0.42);
      buildings[p.key] = { node, pos, cam: cam.toArray(), target: target.toArray(), hits: p.key === "pravak" ? latticeVolumes(node, p.key) : [] };
    }

    const crates = [0, 1, 2, 3, 4].map((i) => get(`erp_crate_${i}`)).filter(Boolean);
    crates.forEach(noShadow);
    const qc = get("erp_qc_light");
    const ringNodes = [0, 1, 2].map((i) => get(`prv_ring_${i}`)).filter(Boolean);
    const ringMats = ringNodes.map((r) => {
      noShadow(r);
      const [m] = ownMaterials(r);
      m.transparent = true;
      m.depthWrite = false;
      return m;
    });
    const floatNodes = [];
    root.traverse((o) => {
      if (o.name.startsWith("rock_float_")) floatNodes.push(o);
    });
    const coreNode = get("plaza_core");
    const turntableNode = get("miq_turntable");
    noShadow(turntableNode);

    const core = pivot(coreNode);
    const anim = {
      crates: crates.map(pivot),
      qcMat: qc ? ownMaterials(qc)[0] : null,
      turntable: pivot(turntableNode),
      rings: ringNodes.map(pivot),
      ringMats,
      beaconMats: ["prv_beacon", "lad_beacon"].map(get).filter(Boolean).map((o) => ownMaterials(o)[0]),
      heartMat: get("med_heart") ? ownMaterials(get("med_heart"))[0] : null,
      sirenR: get("med_siren_r") ? ownMaterials(get("med_siren_r"))[0] : null,
      sirenB: get("med_siren_b") ? ownMaterials(get("med_siren_b"))[0] : null,
      floats: floatNodes.map((o, i) => ({ o: pivot(o), s: i * 1.9 })),
      core,
      drivers,
    };
    return { root, buildings, anim, traffic };
  }, [scene, vehiclesScene, gl, lowPower]);
}

const heartbeat = (t) => {
  const p = t % 1.15;
  return Math.exp(-(((p - 0.08) / 0.045) ** 2)) + 0.65 * Math.exp(-(((p - 0.28) / 0.045) ** 2));
};

function Animator({ anim, reduced }) {
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const speed = reduced ? 0.25 : 1;

    // ERP Edge: crates ride the line and trip the QC scanner as they pass.
    const span = 6.6;
    let nearQc = 1;
    anim.crates.forEach((c, i) => {
      const x = -3.3 + ((t * 0.55 * speed + i * (span / anim.crates.length)) % span);
      c.position.x = x; // pivot sits in the building frame, same as the belt
      const edge = Math.min((x + 3.3) / 0.45, (3.3 - x) / 0.45, 1);
      c.scale.setScalar(Math.max(edge, 0.001));
      nearQc = Math.min(nearQc, Math.abs(x - 0.6));
    });
    if (anim.qcMat) anim.qcMat.emissiveIntensity = nearQc < 0.22 ? 12 : 2.2;

    if (anim.turntable) anim.turntable.rotation.y += dt * 0.45 * speed;

    // Ring-road traffic. A model's nose points along +X, so face the tangent.
    anim.drivers.forEach((d) => {
      d.a += dt * d.speed * speed;
      const x = Math.cos(d.a) * d.r;
      const z = Math.sin(d.a) * d.r;
      const dir = Math.sign(d.speed);
      d.v.position.set(x, ROAD_Y, z);
      d.v.rotation.y = -Math.atan2(Math.cos(d.a) * dir, -Math.sin(d.a) * dir);
    });

    anim.rings.forEach((r, i) => {
      const ph = (t * 0.42 * speed + i / anim.rings.length) % 1;
      r.scale.setScalar(0.35 + ph * 4.2);
      anim.ringMats[i].opacity = Math.pow(1 - ph, 1.6);
    });

    const blink = Math.pow(Math.max(0, Math.sin(t * 2.2)), 10);
    anim.beaconMats.forEach((m) => { m.emissiveIntensity = 1.5 + blink * 14; });
    if (anim.heartMat) anim.heartMat.emissiveIntensity = 2.5 + heartbeat(t) * 11;
    if (anim.sirenR) {
      const on = Math.sin(t * 9) > 0;
      anim.sirenR.emissiveIntensity = on ? 12 : 0.4;
      anim.sirenB.emissiveIntensity = on ? 0.4 : 12;
    }

    anim.floats.forEach((f) => {
      f.o.position.y = f.o.userData.base.y + Math.sin(t * 0.5 + f.s) * 0.35;
      f.o.rotation.y += dt * 0.04;
    });
    if (anim.core) {
      anim.core.rotation.y += dt * 0.9;
      anim.core.rotation.x += dt * 0.3;
      anim.core.position.y = anim.core.userData.base.y + Math.sin(t * 1.3) * 0.15;
    }
  });
  return null;
}

function FocusRing({ building, color }) {
  const ref = useRef();
  const mat = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const k = 0.55 + Math.sin(state.clock.elapsedTime * 2.4) * 0.25;
    mat.current.opacity = building ? k : 0;
  });
  if (!building) return null;
  return (
    <mesh ref={ref} position={[building.pos.x, 0.16, building.pos.z]} rotation-x={-Math.PI / 2}>
      <ringGeometry args={[4.6, 4.68, 128]} />
      <meshBasicMaterial ref={mat} color={new THREE.Color(color).multiplyScalar(1.6)} transparent toneMapped={false} depthWrite={false} />
    </mesh>
  );
}

function Rig({ buildings, activeKey, reduced, interactive, panelOpen }) {
  const ref = useRef();
  const { size } = useThree();
  const busy = useRef(false);
  const lastInput = useRef(-10);
  const isPortrait = size.width < size.height;

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const onStart = () => { busy.current = true; };
    const onEnd = () => { busy.current = false; lastInput.current = performance.now() / 1000; };
    c.addEventListener("controlstart", onStart);
    c.addEventListener("controlend", onEnd);
    return () => {
      c.removeEventListener("controlstart", onStart);
      c.removeEventListener("controlend", onEnd);
    };
  }, []);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const b = activeKey && buildings[activeKey];
    const shot = b ? b : OVERVIEW;
    let cam = shot.cam;
    if (!b) {
      // Pull back on narrow screens so the whole island fits.
      const k = isPortrait ? 1.5 : size.width < 1100 ? 1.2 : 1;
      cam = cam.map((v, i) => (i === 1 ? v * (0.85 + 0.15 * k) : v * k));
    } else if (isPortrait) {
      cam = shot.target.map((t, i) => t + (shot.cam[i] - t) * 1.35);
    }
    const smooth = !reduced;
    busy.current = true;
    c.setLookAt(...cam, ...shot.target, smooth).then(() => {
      busy.current = false;
      lastInput.current = performance.now() / 1000;
    });
    // Keep the subject clear of the overlays: the intro copy on the left in the
    // overview, the details panel on the right when a building is open.
    const wide = !isPortrait && size.width > 900;
    const offset = b ? (panelOpen && wide ? 2.6 : 0) : wide ? -4.5 : 0;
    // On phones the bottom sheet covers the lower half: lift the building into
    // the clear area, and drop the overview below the intro copy.
    const offsetY = isPortrait ? (b ? 4.2 : -3.2) : 0;
    c.setFocalOffset(offset, offsetY, 0, smooth);
  }, [activeKey, buildings, reduced, isPortrait, size.width, panelOpen]);

  useFrame((_, dt) => {
    const c = ref.current;
    if (!c || reduced || activeKey || busy.current) return;
    if (performance.now() / 1000 - lastInput.current < 3) return;
    c.rotate(dt * 0.045, 0, false);
  });

  return (
    <CameraControls
      ref={ref}
      makeDefault
      enabled={interactive}
      minPolarAngle={0.35}
      maxPolarAngle={1.32}
      minDistance={8}
      maxDistance={70}
      smoothTime={0.55}
      draggingSmoothTime={0.12}
      mouseButtons={{ left: 1, middle: 0, right: 0, wheel: 0 }}
      touches={{ one: 1, two: 0, three: 0 }}
    />
  );
}

function Labels({ buildings, activeKey, hoverKey, onSelect, onHover }) {
  return projects.map((p, i) => {
    const b = buildings[p.key];
    if (!b) return null;
    const h = p.key === "ladders" ? 11.6 : p.key === "pravak" ? 9.6 : 4.4;
    const on = activeKey === p.key || hoverKey === p.key;
    const dim = activeKey && activeKey !== p.key;
    return (
      <Html key={p.key} position={[b.pos.x, h, b.pos.z]} center zIndexRange={[20, 0]}>
        <button
          type="button"
          className={`city-label${on ? " is-on" : ""}${dim ? " is-dim" : ""}`}
          style={{ "--accent": p.accent }}
          onClick={() => onSelect(p.key)}
          onPointerEnter={() => onHover(p.key)}
          onPointerLeave={() => onHover(null)}
        >
          <span className="city-label-idx">{String(i + 1).padStart(2, "0")}</span>
          <span className="city-label-name">{p.title}</span>
        </button>
      </Html>
    );
  });
}

function World({ activeKey, hoverKey, onHover, onSelect, lowPower, reduced, interactive, panelOpen, onReady }) {
  const { root, buildings, anim, traffic } = useCity(lowPower);
  const { gl } = useThree();
  const readyFired = useRef(false);

  useFrame(() => {
    if (readyFired.current) return;
    readyFired.current = true;
    onReady?.();
  });

  // The world is static apart from small animated props that don't cast
  // shadows, so the shadow map is rendered once instead of every frame.
  useEffect(() => {
    gl.shadowMap.autoUpdate = false;
    gl.shadowMap.needsUpdate = true;
  }, [gl, root]);

  // Walk up from the hit mesh to its building root. Only the root itself is
  // named exactly B_<key>; its meshes are B_<key>_static_1 and so on.
  const keyOf = (obj) => {
    if (obj.userData.key) return obj.userData.key;
    while (obj) {
      const m = /^B_([a-z]+)$/.exec(obj.name || "");
      if (m && buildings[m[1]]) return m[1];
      obj = obj.parent;
    }
    return null;
  };
  // Hits arrive nearest first. A tree or the ground in front of a building
  // doesn't stop the event, so the building behind it still gets it.
  const pointerMove = (e) => {
    const k = keyOf(e.object);
    if (k) e.stopPropagation();
    onHover(k);
  };
  const click = (e) => {
    const k = keyOf(e.object);
    if (!k) return;
    e.stopPropagation();
    onSelect(k);
  };

  const active = activeKey ? buildings[activeKey] : null;
  const hovered = !active && hoverKey ? buildings[hoverKey] : null;
  const accent = projects.find((p) => p.key === (activeKey || hoverKey))?.accent || "#ffffff";

  return (
    <>
      <primitive object={root} onPointerMove={pointerMove} onClick={click} onPointerOut={() => onHover(null)} />
      <group onPointerMove={pointerMove} onClick={click}>
        {Object.values(buildings).flatMap((b) => b.hits).map((h) => <primitive key={h.uuid} object={h} />)}
      </group>
      <primitive object={traffic} />
      <Animator anim={anim} reduced={reduced} />
      <FocusRing building={active || hovered} color={accent} />
      <Labels buildings={buildings} activeKey={activeKey} hoverKey={hoverKey} onSelect={onSelect} onHover={onHover} />
      <Rig buildings={buildings} activeKey={activeKey} reduced={reduced} interactive={interactive} panelOpen={panelOpen} />
    </>
  );
}

function Lights({ lowPower }) {
  return (
    <>
      <hemisphereLight args={["#8090ff", "#0b120e", 0.75]} />
      <ambientLight intensity={0.12} color="#9fb0ff" />
      <directionalLight
        position={[-16, 28, 14]}
        intensity={1.6}
        color="#c4d0ff"
        castShadow={!lowPower}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-19}
        shadow-camera-right={19}
        shadow-camera-top={19}
        shadow-camera-bottom={-19}
        shadow-camera-near={1}
        shadow-camera-far={80}
        shadow-bias={-0.0005}
        shadow-normalBias={0.04}
      />
      <directionalLight position={[18, 6, -14]} intensity={0.35} color="#ff9a6a" />
      <pointLight position={[0, 3.2, 0]} intensity={28} distance={13} decay={2} color="#ffb870" />
    </>
  );
}

export default function CityScene({
  activeKey,
  hoverKey,
  onHover,
  onSelect,
  lowPower = false,
  reduced = false,
  interactive = true,
  visible = true,
  panelOpen = false,
  onReady,
}) {
  const [dpr, setDpr] = useState(lowPower ? 1.25 : 1.6);
  return (
    <Canvas
      shadows={!lowPower}
      dpr={dpr}
      frameloop={visible ? "always" : "never"}
      camera={{ fov: 35, near: 0.5, far: 220, position: OVERVIEW.cam }}
      gl={{ antialias: false, stencil: false, powerPreference: "high-performance" }}
      onPointerMissed={() => onSelect(null)}
      style={{ position: "absolute", inset: 0 }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(lowPower ? 1.25 : 1.6)} flipflops={3} />
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 42, 110]} />
      <Stars radius={110} depth={50} count={lowPower ? 900 : 2200} factor={3.2} saturation={0} fade speed={0.4} />
      <Lights lowPower={lowPower} />
      <World
        activeKey={activeKey}
        hoverKey={hoverKey}
        onHover={onHover}
        onSelect={onSelect}
        lowPower={lowPower}
        reduced={reduced}
        interactive={interactive}
        panelOpen={panelOpen}
        onReady={onReady}
      />
      <EffectComposer multisampling={lowPower ? 0 : 4}>
        <Bloom mipmapBlur intensity={0.9} luminanceThreshold={1} luminanceSmoothing={0.25} radius={0.72} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </Canvas>
  );
}
