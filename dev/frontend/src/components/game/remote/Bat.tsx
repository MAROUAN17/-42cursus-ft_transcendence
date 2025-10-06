import React, { MouseEvent, useRef } from "react";

interface BatProps {
  x: number;
  y: number;
  side: "left" | "right";
  height: number;
}

export default function RBat({ x, y, side, height}: BatProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const sideStyle = side === "left" ? { left:  x + "px"} : { right: x + "px" };

  return (
	<div
	  ref={ref}
	  className="w-[18px] border-4 border-neon rounded-xl shadow-neon bg-white absolute cursor-grab"
	  style={{ top: `${y}px`, height: `${height}px`, ...sideStyle }}
	/>
  );
}