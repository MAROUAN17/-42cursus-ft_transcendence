import React from "react";

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

export default function Bat({ y, setY, side, height,  containerHeight, bodyColor, borderColor, shadowColor }: BatProps) {

  return (
    <div
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
