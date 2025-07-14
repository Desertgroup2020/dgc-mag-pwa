"use client";
import { useAppSelector } from "@/redux/hooks";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap, { TimelineLite } from "gsap";

function PageLoader() {
  const isRouteChanging = useAppSelector((state) => state.window.routeChanging);
  const comp = useRef<HTMLDivElement | null>(null);
  const timeline = useRef<TimelineLite | null>(null);
  const [animationDuration, setAnimationDuration] = useState<number>(2); // Default duration
  const startTimestamp = useRef<number | null>(null);

  useEffect(() => {
    if (isRouteChanging) {
      // Record the timestamp when the route starts changing
      startTimestamp.current = performance.now();
    } else {
      if (startTimestamp.current !== null) {
        // Calculate the time difference when route stops changing
        const endTimestamp = performance.now();
        const duration = endTimestamp - startTimestamp.current;
        setAnimationDuration(duration / 1000); // Convert to seconds
        startTimestamp.current = null;
      }
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline();

      if (isRouteChanging) {
        timeline.to("#juice", {
          width: "100%",
          delay: 1.3,
          duration: animationDuration,
        });
      } else {
        timeline.to("#juice", {
          width: "0%",
          duration: animationDuration,
        });
      }
    }, comp);

    return () => ctx.revert();
  }, [isRouteChanging, animationDuration]);

  return (
    <div className="page_loader" ref={comp}>
      <div className="juice animate-pulse" id="juice"></div>
    </div>
  );
}

export default PageLoader;
