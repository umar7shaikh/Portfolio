// Beat helpers for tour scripts (see ProductTour.jsx).
export const note = (say, at = 0, id) => ({ at, say, id });
export const tap = (target, say, aim = 1300, press = 650) => [
  { at: aim, target, say },
  { at: press, target, click: true, say },
];
