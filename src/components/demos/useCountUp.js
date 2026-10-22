import { useEffect, useState } from "react";

// Eases a number up from 0 for KPI tiles.
export function useCountUp(target, decimals = 0, ms = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / ms);
      setV(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
