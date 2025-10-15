import React, { MouseEvent, useRef } from "react";

interface BatProps {
  y: number;
  setY: (y: number) => void;
  side: "left" | "right";
  height: number;
  containerTop: number;
  containerHeight: number;
  bodyColor: string;
  borderColor: string;
  shadowColor: string;
}

export default function Bat({ y, setY, side, height, containerTop, containerHeight, bodyColor, borderColor, shadowColor }: BatProps) {
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

  const sideStyle = side === "left" ? { "--ball-left": "1.5rem" } : { "--ball-right": "1.5rem" };

  return (
    <div
      ref={ref}
      onMouseDown={handleMouseDown}
      className={`w-[18px] border-4 top-[var(--ball-top)] h-[var(--ball-height)] border-[var(--borderColor)] bg-[var(--bodyColor)] shadow-[0_0_10px_var(--shadowColor)] ${
        side === "left" ? "left-[var(--ball-left)]" : "right-[var(--ball-right)]"
      } rounded-xl absolute cursor-grab`}
      style={
        {
          "--borderColor": borderColor,
          "--bodyColor": bodyColor,
          "--shadowColor": shadowColor,
          "--ball-top": `${y}px`,
          "--ball-height": `${height}px`,
          "--ball-left": "1.5rem",
          "--ball-right": "1.5rem",
        } as React.CSSProperties
      }
    />
  );
}
