import React, { useEffect, useRef } from "react";

interface BallProps {
  ballPos: { x: number; y: number };
  setBallPos: (p: { x: number; y: number }) => void;
  ballVel: { x: number; y: number };
  setBallVel: (v: { x: number; y: number }) => void;
  paddleLeft: { x: number; y: number; width: number; height: number } | null;
  paddleRight: { x: number; y: number; width: number; height: number } | null;
  bounds: { width: number; height: number };
  onScore: (who: "left" | "right") => void;
}

export default function RBall({ ballPos, setBallPos, ballVel, setBallVel, paddleLeft, paddleRight, bounds }: BallProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={ref}
      className="w-[20px] h-[20px] rounded-full bg-white absolute"
      style={{ left: `${ballPos.x - 10}px`, top: `${ballPos.y - 10}px` }}
    />
  );
}