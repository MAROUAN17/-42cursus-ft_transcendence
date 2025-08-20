import React, { useEffect, useRef } from "react";
import type { Ball } from "./Types";

interface BallProps {
  dir:{x: number, y:number};
  setDir: (d: {x:number; y:number}) => void
  ball: Ball;
  setBallPos: (p: { x: number; y: number }) => void;
  ballVel: { x: number; y: number };
  setBallVel: (v: { x: number; y: number }) => void;
  paddleLeft: { x: number; y: number; width: number; height: number } | null;
  paddleRight: { x: number; y: number; width: number; height: number } | null;
  bounds: { width: number; height: number };
  onScore: (who: "left" | "right") => void;
  updateVel:(type:string) => void;
}

export default function RBall({ ball, dir, setDir, paddleLeft, paddleRight, bounds, onScore, updateVel}: BallProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect (() => {
    const dt = 1 / 60;
    let nx = ball.x + ball.velX * dt;
    let ny = ball.y + ball.velY * dt;
    if (ny - 5 <= 10) {
      ny = 10;
      updateVel("vely")
      setDir({x:dir.x, y:-1})
    } else if (ny  + 5 >= bounds.height)
    {
      ny = bounds.height - 10;
      updateVel("vely")
      setDir({x:dir.x, y:-1})
    }
    const ballRect = { left: nx - 10, right: nx + 10, top: ny - 10, bottom: ny + 10 };
    const checkPaddleCollision = (paddle: any) => {
      if (!paddle) return false;
      const paddleRect = { left: paddle.x, right: paddle.x + paddle.width, top: paddle.y, bottom: paddle.y + paddle.height };
      return !(ballRect.right < paddleRect.left || ballRect.left > paddleRect.right || ballRect.bottom < paddleRect.top || ballRect.top > paddleRect.bottom);
    };
    
    if (dir.x < 0 && checkPaddleCollision(paddleLeft)) {
      console.log("left pad touched");
      updateVel("velx")
      setDir({x:-dir.x, y:dir.y})
    }
    if (dir.x > 0 && checkPaddleCollision(paddleRight)) {
      console.log("right pad touched");
      updateVel("velx")
      setDir({x:-dir.x, y:dir.y})
    }
    if (nx < -10) {
      onScore("right");
      return ;
    }
    if (nx > bounds.width + 10)
    {
      onScore("left")
      return ;
    }

  })
  return (
    <div
      ref={ref}
      className="w-[20px] h-[20px] rounded-full bg-white absolute"
      style={{ left: `${ball.x - 10}px`, top: `${ball.y - 10}px` }}
    />
  );
}