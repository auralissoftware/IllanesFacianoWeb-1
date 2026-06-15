import { useEffect, useRef } from "react";

type Point = { x: number; y: number };

function lerp(current: number, target: number, amount: number) {
  return current + (target - current) * amount;
}

export function PageAmbientBackground() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const target: Point = {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.45,
    };
    const glow: Point = { ...target };

    function handlePointerMove(event: PointerEvent) {
      target.x = event.clientX;
      target.y = event.clientY;
    }

    let frame = 0;

    function tick() {
      if (!reducedMotion) {
        glow.x = lerp(glow.x, target.x, 0.07);
        glow.y = lerp(glow.y, target.y, 0.07);
      }

      glowRef.current?.style.setProperty("--x", `${glow.x}px`);
      glowRef.current?.style.setProperty("--y", `${glow.y}px`);

      frame = window.requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="page-ambient" aria-hidden>
      <div className="page-ambient-base" />
      <div ref={glowRef} className="page-ambient-glow" />
    </div>
  );
}
