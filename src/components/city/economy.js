// The island's live numbers. The 3D simulation reports events here (a carton
// passing QC, a car sold, a call answered) and the overlay reads them through
// useSyncExternalStore. Everything is simulated; counts start from a figure
// that grows with the visitor's time of day so "today" always looks lived in.

const daySeconds = () => {
  const d = new Date();
  return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
};

// [key, label, seconds per event before the visitor arrived]
export const METRICS = [
  ["cartons", "cartons passed QC", 7],
  ["dispatched", "orders dispatched", 160],
  ["calls", "calls answered", 40],
  ["consults", "questions answered", 55],
  ["reads", "articles read", 25],
];

// Which building each metric belongs to, for the project panel.
export const BUILDING_METRICS = {
  erp: ["cartons", "dispatched"],
  pravak: ["calls"],
  medbot: ["consults"],
  ladders: ["reads"],
};

const s = daySeconds();
let state = Object.fromEntries(METRICS.map(([k, , every]) => [k, Math.floor(s / every)]));
let last = null; // most recent event, for the ticker
const listeners = new Set();

export const economy = {
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  getSnapshot: () => state,
  getLast: () => last,
  bump(key, text, n = 1) {
    state = { ...state, [key]: state[key] + n };
    last = { key, text, at: performance.now() };
    listeners.forEach((fn) => fn());
  },
};
