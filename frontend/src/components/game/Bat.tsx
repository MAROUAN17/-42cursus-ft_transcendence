import React, { MouseEvent, useRef } from "react";

interface BatProps {
  y: number;
  setY: (y: number) => void;
  side: "left" | "right";
  height: number;
  containerTop: number;
  containerHeight: number;
}

export default function Bat({ y, setY, side, height, containerTop, containerHeight }: BatProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startY = e.clientY;
    const startTop = y;

    const onMove = (ev: MouseEvent) => {
      const dy = ev.clientY - startY;
      const newY = Math.max(0, Math.min(containerHeight - height, startTop + dy));
      setY(newY);
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove as any);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove as any);
    window.addEventListener("mouseup", onUp);
  };

  const sideStyle = side === "left" ? { left: "1.5rem" } : { right: "1.5rem" };

  return (
    <div
      ref={ref}
      onMouseDown={handleMouseDown}
      className="w-[18px] border-4 border-neon rounded-xl shadow-neon bg-white absolute cursor-grab"
      style={{ top: `${y}px`, height: `${height}px`, ...sideStyle }}
    />
  );
}