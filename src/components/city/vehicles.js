// Vehicles from the Motoriq 3D lot (Vehicle-management-system/frontend/public/lot-models),
// packed by tools/blender/vehicles.py. Meshes carry the lot's material names and
// get their materials here, the same way the lot engine does it: shared trims,
// glass and lights, plus one paint material per colour.
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export const VEHICLES_URL = "/models/vehicles.glb";
// The island is a miniature: buildings are roughly 45% of real size.
export const VEHICLE_SCALE = 0.45;

export function createVehicleFactory(vehiclesScene, gl) {
  // A small studio reflection, applied to vehicles only, so paint and glass
  // have something to catch without brightening the rest of the night scene.
  const pmrem = new THREE.PMREMGenerator(gl);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const std = (o) => new THREE.MeshStandardMaterial({ envMap: env, envMapIntensity: 0.5, ...o });
  const M = {
    glass: std({ color: 0x0a0f14, roughness: 0.06, metalness: 0.25 }),
    tyre: std({ color: 0x141518, roughness: 0.9, envMapIntensity: 0.1 }),
    dark: std({ color: 0x15171b, roughness: 0.6, envMapIntensity: 0.2 }),
    trim: std({ color: 0x26282d, roughness: 0.7, envMapIntensity: 0.25 }),
    metal: std({ color: 0xd2d5da, roughness: 0.25, metalness: 0.9, envMapIntensity: 0.9 }),
    rim: std({ color: 0xc9ccd2, roughness: 0.25, metalness: 0.9, envMapIntensity: 0.9 }),
    // lights glow at night: headlamps feed the bloom pass
    lamp: std({ color: 0xf2f6ff, emissive: 0xfff3d6, emissiveIntensity: 3.2, roughness: 0.1 }),
    tail: std({ color: 0x9c0c14, emissive: 0xff1a22, emissiveIntensity: 2.4, roughness: 0.15 }),
    plate: std({ color: 0xf1f1ee, roughness: 0.5, envMapIntensity: 0.3 }),
    cargo: std({ color: 0xd6d9de, roughness: 0.5, metalness: 0.15, envMapIntensity: 0.4 }),
    tint: std({ color: 0x1b262e, transparent: true, opacity: 0.62, roughness: 0.04, depthWrite: false }),
    liner: std({ color: 0x1b1c1f, roughness: 0.9, envMapIntensity: 0.15 }),
    seat: std({ color: 0x3d4047, roughness: 0.85, envMapIntensity: 0.15 }),
    lens: std({ color: 0x08090b, roughness: 0.08, metalness: 0.3 }),
  };
  const paints = new Map();
  const paint = (hex) => {
    if (!paints.has(hex)) {
      paints.set(hex, std({ color: new THREE.Color(hex), roughness: 0.32, metalness: 0.45, envMapIntensity: 0.85 }));
    }
    return paints.get(hex);
  };

  return function makeVehicle(model, hex, { shadows = true } = {}) {
    const src = vehiclesScene.getObjectByName(`V_${model}`);
    if (!src) return null;
    const v = src.clone(true);
    v.position.set(0, 0, 0);
    v.rotation.set(0, 0, 0);
    v.scale.setScalar(VEHICLE_SCALE);
    v.traverse((o) => {
      if (!o.isMesh) return;
      const name = (o.material?.name || "").split(".")[0];
      o.material = name === "paint" ? paint(hex) : M[name] || M.trim;
      o.castShadow = shadows && !o.material.transparent;
      o.receiveShadow = shadows;
      if (o.material.transparent) o.renderOrder = 2;
    });
    return v;
  };
}

// slot_<model>_<rrggbb>, as written by tools/blender/city.py
export const parseSlot = (name) => {
  const m = /^slot_(.+)_([0-9a-f]{6})/.exec(name || "");
  return m ? { model: m[1], hex: `#${m[2]}` } : null;
};
