// The living island: the buildings run the systems they stand for.
//   ERP Edge   cartons ride the line, the QC gate passes or rejects each one,
//              and every six good cartons the truck backs out and drives a
//              delivery lap round the island before docking again.
//   Motoriq    now and then a lot car goes out for a test drive lap.
//   Pravak, MedBot, TheLadders  calls, consults and reads tick over as pulses.
// Vehicles share the ring road's inner lane at one speed, so they never close
// on each other; a vehicle only joins the lane where there is a gap.
import * as THREE from "three";
import { economy } from "./economy.js";

export const ROAD_Y = 0.025;
const PLOT_Y = 0.12;
const R_IN = 13.45;
const R_OUT = 14.25;
const LANE_V = 2.15; // inner lane, units per second
const GAP = 0.6; // radians kept between vehicles in the inner lane (about 8 units)
const BATCH = 6; // cartons per dispatch

const TAU = Math.PI * 2;
const wrap = (a) => ((a % TAU) + TAU) % TAU;
const angDist = (a, b) => {
  const d = wrap(a - b);
  return Math.min(d, TAU - d);
};
const yawOf = (x, z) => Math.atan2(-z, x); // vehicle noses point along +X
const lerpAngle = (a, b, k) => a + (wrap(b - a + Math.PI) - Math.PI) * k;
const smooth = (x) => {
  const k = Math.min(1, Math.max(0, x));
  return k * k * (3 - 2 * k);
};
const rnd = (i, n) => {
  let h = (i * 374761393 + n * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
const worldYaw = (o) => {
  const q = o.getWorldQuaternion(new THREE.Quaternion());
  const f = new THREE.Vector3(1, 0, 0).applyQuaternion(q);
  return yawOf(f.x, f.z);
};

class Lane {
  constructor(r, w) {
    this.r = r;
    this.w = w; // radians per second, the sign is the direction
    this.occ = new Set();
  }
  at(a, y = ROAD_Y) {
    return new THREE.Vector3(Math.cos(a) * this.r, y, Math.sin(a) * this.r);
  }
  yaw(a) {
    const d = Math.sign(this.w);
    return yawOf(-Math.sin(a) * d, Math.cos(a) * d);
  }
  angle(o, t) {
    return o.a0 + this.w * (t - o.t0);
  }
  join(t0, a0) {
    const o = { t0, a0, t1: Infinity };
    this.occ.add(o);
    return o;
  }
  leave(o, t) {
    o.t1 = t;
  }
  prune(t) {
    for (const o of this.occ) if (o.t1 < t) this.occ.delete(o);
  }
  // Would a vehicle at angle a at time t keep `gap` from everyone in the lane?
  // Compared at whichever time both are in it; after that they move together.
  clear(t, a, gap = GAP, self = null) {
    for (const o of this.occ) {
      if (o === self) continue;
      const T = Math.max(t, o.t0);
      if (T > o.t1) continue;
      if (angDist(a + this.w * (T - t), this.angle(o, T)) < gap) return false;
    }
    return true;
  }
  // Is anyone within `gap` of the fixed angle a at any moment of [t0, t1]?
  busyNear(a, t0, t1, gap) {
    for (let t = t0; t <= t1; t += 0.2) {
      for (const o of this.occ) {
        if (t >= o.t0 && t <= o.t1 && angDist(this.angle(o, t), a) < gap) return true;
      }
    }
    return false;
  }
}

// Has an angle moving in direction `dir` just gone past `target`?
const passed = (a, prev, target, dir) => wrap((target - a) * dir) > wrap((target - prev) * dir) + Math.PI;

// A drive along a spline. With `from`/`to` speeds it accelerates linearly
// between them (joining or leaving the lane); with neither it eases in and out.
class Path {
  constructor(points, { from = 0, to = 0, reverse = false, cruise = 1.3, startYaw, endYaw } = {}) {
    this.curve = new THREE.CatmullRomCurve3(points, false, "centripetal");
    this.len = this.curve.getLength();
    Object.assign(this, { from, to, reverse, startYaw, endYaw });
    this.T = from || to ? (2 * this.len) / (from + to) : (1.5 * this.len) / cruise;
    this.t = 0;
  }
  get end() {
    return this.curve.getPointAt(1);
  }
  step(v, dt) {
    this.t = Math.min(this.T, this.t + dt);
    const { t, T, len, from, to } = this;
    const d = from || to ? from * t + ((to - from) * t * t) / (2 * T) : len * smooth(t / T);
    const u = Math.min(1, d / len);
    v.position.copy(this.curve.getPointAt(u));
    const tan = this.curve.getTangentAt(u);
    let yaw = yawOf(tan.x, tan.z) + (this.reverse ? Math.PI : 0);
    if (this.startYaw !== undefined) yaw = lerpAngle(this.startYaw, yaw, smooth(u / 0.25));
    if (this.endYaw !== undefined) yaw = lerpAngle(yaw, this.endYaw, smooth((u - 0.7) / 0.3));
    v.rotation.set(0, yaw, 0);
    return this.t >= T;
  }
}

const angleOf = (p) => Math.atan2(p.z, p.x);

export function createLiving({ buildings, makeVehicle, movers, crates, qcMat }) {
  const inner = new Lane(R_IN, LANE_V / R_IN);
  const outer = new Lane(R_OUT, -0.085);
  const dir = Math.sign(inner.w);
  const ctx = { now: 0, dt: 0 };
  const sim = { packed: 0, drive: null, nextDrive: 18, nextCall: 4, nextConsult: 7, nextRead: 3 };
  const fx = { call: -10, consult: -10, read: -10, qc: { at: -10, fail: false } };
  const agents = [];

  // Building-local helpers. Blender's (x, y, height) on the plot, where +y
  // faces the road and +x runs with the inner lane.
  const local = (key, x, y, h = PLOT_Y) => {
    const node = buildings[key].node;
    return new THREE.Vector3(x, h, -y).applyMatrix4(node.matrixWorld);
  };
  const ring = (key, x, r) => {
    const b = angleOf(buildings[key].pos);
    const a = b + ((x / r) * buildings[key].side);
    return new THREE.Vector3(Math.cos(a) * r, ROAD_Y, Math.sin(a) * r);
  };
  for (const key of Object.keys(buildings)) {
    // which way local +x turns around the island (it should match the lane)
    buildings[key].side = Math.sign(wrap(angleOf(local(key, 1, 0)) - angleOf(buildings[key].pos) + Math.PI) - Math.PI) || 1;
  }

  // Take a parked vehicle out of its building into world space.
  const adopt = (slotVehicle, key) => {
    movers.attach(slotVehicle);
    slotVehicle.rotation.set(0, worldYaw(slotVehicle), 0);
    // The shadow map is baked once, so anything that moves can't cast.
    slotVehicle.traverse((o) => {
      o.userData.key = key;
      o.castShadow = false;
    });
    return slotVehicle;
  };

  function* drive(v, path) {
    while (!path.step(v, ctx.dt)) yield;
  }
  function* wait(s) {
    for (let t = 0; t < s; t += ctx.dt) yield;
  }
  // Ride the lane until wantExit says so; returns the exit angle.
  function* cruise(v, occ, wantExit) {
    let prev = inner.angle(occ, ctx.now);
    for (;;) {
      const a = inner.angle(occ, ctx.now);
      v.position.copy(inner.at(a));
      v.rotation.set(0, inner.yaw(a), 0);
      if (wantExit(a, prev)) return a;
      prev = a;
      yield;
    }
  }
  // Pull onto the lane along `points` once the lane has room at the merge.
  function* merge(v, makePath, extraClear = () => true) {
    for (;;) {
      const path = makePath();
      const a = angleOf(path.end);
      if (inner.clear(ctx.now + path.T, a) && extraClear(path)) {
        const occ = inner.join(ctx.now + path.T, a);
        yield* drive(v, path);
        return occ;
      }
      yield;
    }
  }
  // ---- ERP Edge: the belt and the dispatch truck ----
  const QC_X = 0.6;
  const SPAN = 6.6;
  const qcBase = qcMat ? { color: qcMat.emissive.clone(), k: qcMat.emissiveIntensity } : null;
  const PASS = new THREE.Color("#3dff9a");
  const FAIL = new THREE.Color("#ff3048");
  function belt(t) {
    crates.forEach((c, i) => {
      const raw = t * 0.55 + i * (SPAN / crates.length);
      const n = Math.floor(raw / SPAN);
      const x = -3.3 + (raw % SPAN);
      const u = c.userData;
      if (u.cycle !== n) {
        u.judged = u.cycle === undefined && x >= QC_X; // don't judge what was past the gate at load
        u.cycle = n;
        u.fail = rnd(i, n) < 1 / 7;
      }
      if (!u.judged && x >= QC_X) {
        u.judged = true;
        fx.qc = { at: ctx.now, fail: u.fail };
        if (!u.fail) {
          sim.packed = Math.min(sim.packed + 1, BATCH * 2);
          economy.bump("cartons", "ERP Edge · carton passed QC");
        }
      }
      // rejects lift off the line before the end
      const lift = u.fail && u.judged ? smooth((x - QC_X) / 0.9) : 0;
      c.position.x = x;
      c.position.y = c.userData.base.y + lift * 0.9;
      const edge = Math.min((x + 3.3) / 0.45, (3.3 - x) / 0.45, 1);
      c.scale.setScalar(Math.max(edge * (1 - lift), 0.001));
    });
    if (qcMat) {
      const since = ctx.now - fx.qc.at;
      if (since < 0.6) {
        qcMat.emissive.copy(fx.qc.fail ? FAIL : PASS);
        qcMat.emissiveIntensity = 14 * (1 - since / 0.6) + 2;
      } else {
        qcMat.emissive.copy(qcBase.color);
        qcMat.emissiveIntensity = qcBase.k;
      }
    }
  }

  const findSlot = (key, model) => {
    let found = null;
    buildings[key].node.traverse((o) => {
      if (!found && o.name.startsWith(`slot_${model}`) && o.parent === buildings[key].node && o.children[0]) found = o;
    });
    return found;
  };

  const truckSlot = buildings.erp && findSlot("erp", "mini_truck");
  if (truckSlot) {
    // Blender parks the truck nose out; it lives nose in, backed up to the
    // pallets after its first run. Backing out happens from the dock, where it
    // can wait for a clear road for as long as it takes.
    const v = adopt(truckSlot.children[0], "erp");
    const dock = v.position.clone();
    const outYaw = v.rotation.y;
    const inYaw = outYaw + Math.PI;
    const SHOULDER = ring("erp", 2.2, 13.3);
    const yard = angleOf(ring("erp", 2.8, R_IN));
    agents.push((function* truck() {
      for (let first = true; ; first = false) {
        while (sim.packed < BATCH) yield;
        let occ;
        if (first) {
          occ = yield* merge(v, () => new Path(
            [dock, local("erp", 3.1, 3.55, 0.07), ring("erp", 3.7, 13.05), ring("erp", 5.3, R_IN)],
            { to: LANE_V, startYaw: outYaw, endYaw: inner.yaw(angleOf(ring("erp", 5.3, R_IN))) },
          ));
        } else {
          for (;;) {
            const back = new Path([dock, local("erp", 3.0, 3.6, 0.07), SHOULDER], { reverse: true, cruise: 0.8, startYaw: inYaw, endYaw: inner.yaw(angleOf(SHOULDER)) });
            const go = new Path([SHOULDER, ring("erp", 3.4, 13.38), ring("erp", 5.0, R_IN)], { to: LANE_V, startYaw: inner.yaw(angleOf(SHOULDER)) });
            const end = angleOf(go.end);
            if (!inner.busyNear(yard, ctx.now, ctx.now + back.T + 0.8, 0.55) && inner.clear(ctx.now + back.T + go.T, end)) {
              occ = inner.join(ctx.now + back.T + go.T, end);
              yield* drive(v, back);
              yield* drive(v, go);
              break;
            }
            yield;
          }
        }
        sim.packed -= BATCH;
        economy.bump("dispatched", "ERP Edge · order dispatched");
        // One lap of the island, then off the lane straight into the dock, nose in.
        const a = yield* cruise(v, occ, (a, prev) => passed(a, prev, angleOf(ring("erp", -0.4, R_IN)), dir));
        inner.leave(occ, ctx.now);
        yield* drive(v, new Path(
          [inner.at(a), ring("erp", 1.3, 13.25), local("erp", 2.55, 3.95, 0.05), local("erp", 3.0, 3.35, 0.1), dock],
          { from: LANE_V, to: 0, startYaw: inner.yaw(a), endYaw: inYaw },
        ));
        v.position.copy(dock);
        v.rotation.set(0, inYaw, 0);
        yield* wait(4); // loading the next order
      }
    })());
  }

  // ---- Motoriq: test drives from the lot ----
  const lots = [];
  if (buildings.motoriq) {
    const routes = [
      {
        model: "hatchback",
        out: [[2.5, 2.7], [3.3, 13.0, "r"], [4.6, R_IN, "r"]],
        exitX: -2.6,
        home: [[-1.3, 13.1, "r"], [0.1, 3.0]],
      },
      {
        model: "sedan",
        out: [[-0.5, 2.6], [0.0, 3.4], [1.4, 13.2, "r"], [2.8, R_IN, "r"]],
        exitX: -4.9,
        home: [[-3.6, 13.1, "r"], [-2.2, 3.05]],
      },
    ];
    const pt = ([x, y, r]) => (r ? ring("motoriq", x, y) : local("motoriq", x, y, 0.08));
    for (const rt of routes) {
      const slot = findSlot("motoriq", rt.model);
      if (!slot) continue;
      const lot = { parked: true };
      lots.push(lot);
      const v = adopt(slot.children[0], "motoriq");
      const home = v.position.clone();
      const homeYaw = v.rotation.y;
      agents.push((function* car() {
        for (;;) {
          while (sim.drive !== lot) yield;
          lot.parked = false;
          sim.drive = null;
          const end = pt(rt.out[rt.out.length - 1]);
          const occ = yield* merge(v, () => new Path(
            [home, ...rt.out.map(pt)],
            { to: LANE_V, startYaw: homeYaw, endYaw: inner.yaw(angleOf(end)) },
          ));
          // the home turn sits just behind the merge, so this is one full lap
          const exitA = angleOf(ring("motoriq", rt.exitX, R_IN));
          const a = yield* cruise(v, occ, (a, prev) => passed(a, prev, exitA, dir));
          inner.leave(occ, ctx.now);
          yield* drive(v, new Path([inner.at(a), ...rt.home.map(pt), home], { from: LANE_V, to: 0, startYaw: inner.yaw(a), endYaw: homeYaw }));
          v.position.copy(home);
          v.rotation.set(0, homeYaw, 0);
          lot.parked = true;
        }
      })());
    }
  }

  // ---- Background traffic: a taxi in the inner lane, a car in the outer ----
  const through = [];
  const add = (lane, model, hex, a0) => {
    const v = makeVehicle(model, hex, { shadows: false });
    if (!v) return;
    movers.add(v);
    through.push({ v, lane, occ: lane.join(0, a0) });
  };
  add(inner, "auto", "#f5c518", 0);
  add(outer, "hatchback", "#2bb3a3", Math.PI);

  return {
    fx,
    update(dt) {
      ctx.dt = Math.min(dt, 0.1);
      ctx.now += ctx.dt;
      const t = ctx.now;

      belt(t);
      for (const d of through) {
        const a = d.lane.angle(d.occ, t);
        d.v.position.copy(d.lane.at(a));
        d.v.rotation.set(0, d.lane.yaw(a), 0);
      }

      if (!sim.drive && t > sim.nextDrive && lots.length && lots.every((l) => l.parked)) {
        sim.drive = lots[Math.floor(Math.random() * lots.length)];
        sim.nextDrive = t + 32 + Math.random() * 20;
      }
      if (t > sim.nextCall) {
        sim.nextCall = t + 8 + Math.random() * 9;
        fx.call = t;
        economy.bump("calls", "Pravak AI · call answered");
      }
      if (t > sim.nextConsult) {
        sim.nextConsult = t + 11 + Math.random() * 10;
        fx.consult = t;
        economy.bump("consults", "MedBot · question answered");
      }
      if (t > sim.nextRead) {
        sim.nextRead = t + 5 + Math.random() * 7;
        fx.read = t;
        economy.bump("reads", "TheLadders · article read");
      }

      for (const a of agents) a.next();
      inner.prune(t);
      outer.prune(t);
    },
    now: () => ctx.now,
    debug: { sim, inner, outer, buildings, lots },
  };
}
