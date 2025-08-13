import React, { MouseEvent, useRef } from "react";

interface BatProps {
  y: number;
  setY: (y: number) => void;
  side: "left" | "right";
  height: number;
  containerTop: number;
  containerHeight: number;
}

export default function RBat({ y, setY, side, height, containerTop, containerHeight }: BatProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const sideStyle = side === "left" ? { left: "1.5rem" } : { right: "1.5rem" };

  return (
	<div
	  ref={ref}
	  className="w-[18px] border-4 border-neon rounded-xl shadow-neon bg-white absolute cursor-grab"
	  style={{ top: `${y}px`, height: `${height}px`, ...sideStyle }}
	/>
  );
}