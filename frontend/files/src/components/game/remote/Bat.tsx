import React, { MouseEvent, useRef } from "react";

interface BatProps {
  x: number;
  y: number;
  side: "left" | "right";
  height: number;
  bodyColor: string;
  borderColor: string;
  shadowColor: string;
}

export default function RBat({ x, y, side, height, bodyColor, borderColor, shadowColor }: BatProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const sideStyle = side === "left" ? { "--ball-left": "1.5rem" } : { "--ball-right": "1.5rem" };

  return (
    <div
      ref={ref}
      className={`w-[18px] border-4 rounded-full top-[var(--ball-top)] h-[var(--ball-height)] border-[var(--borderColor)] bg-[var(--bodyColor)] shadow-[0_0_10px_var(--shadowColor)] ${
        side === "left" ? "left-[var(--ball-left)]" : "right-[var(--ball-right)]"
      } absolute cursor-grab`}
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
