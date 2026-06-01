import { useState, useEffect } from "react";

// Returns true on small screens. Used to swap heavy desktop demos for
// lightweight phone-screen variants.
export default function useIsMobile(query = "(max-width: 640px)") {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return isMobile;
}
