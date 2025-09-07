import React, { useEffect, useRef, useState } from "react";
import type { Ball } from "./Types";

interface BallProps {
  dir: { x: number; y: number };
  setDir: (d: { x: number; y: number }) => void;
  ball: Ball;
  setBallPos: (p: { x: number; y: number }) => void;
  ballVel: { x: number; y: number };
  setBallVel: (v: { x: number; y: number }) => void;
  paddleLeft: { x: number; y: number; width: number; height: number } | null;
  paddleRight: { x: number; y: number; width: number; height: number } | null;
  bounds: { width: number; height: number };
  onScore: (who: "left" | "right") => void;
}

export default function RBall({
  ball,
  dir,
  setDir,
  paddleLeft,
  paddleRight,
  bounds,
  onScore,
}: BallProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const localDir = useRef(dir);

  useEffect(() => {
    localDir.current = dir;
  }, [dir]);

  useEffect(() => {
    const dt = 1 / 60;
    let nx = ball.x + ball.velX * dt;

    if (nx < -10) {
      onScore("right");
      return;
    }
    if (nx > bounds.width + 10) {
      onScore("left");
      return;
    }
  }, [ball, paddleLeft, paddleRight, bounds, onScore, setDir]);

  return (
    <div
      ref={ref}
      className="w-[20px] h-[20px] rounded-full bg-white absolute"
      style={{ left: `${ball.x - 10}px`, top: `${ball.y - 10}px` }}
    />
  );
}
