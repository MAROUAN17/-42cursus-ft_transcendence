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
  updateVel: (type: string) => void;
  leftY: number;
  rightY:number;
}

export default function RBall({
  ball,
  dir,
  setDir,
  paddleLeft,
  paddleRight,
  bounds,
  onScore,
  updateVel,
  leftY,
  rightY,
}: BallProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [i, setI] = useState(0);

  const localDir = useRef(dir);
  const hasBounced = useRef({ top: false, bottom: false });

  useEffect(() => {
    localDir.current = dir;
  }, [dir]);

  useEffect(() => {
    const dt = 1 / 60;
    let nx = ball.x + ball.velX * dt;
    let ny = ball.y + ball.velY * dt;

    if (ny - 10 <= 0) {
      ny = 10;
      if (!hasBounced.current.top) {
        updateVel("vely");
        localDir.current.y = -1; 
        hasBounced.current.top = true;
      }
    } else {
      hasBounced.current.top = false;
    }

    if (ny + 10 >= bounds.height) {
      ny = bounds.height - 10;
      if (!hasBounced.current.bottom) {
        updateVel("vely");
        localDir.current.y = -1;
        hasBounced.current.bottom = true;
      }
    } else {
      hasBounced.current.bottom = false;
    }
    const ballRect = {
      left: nx - 10,
      right: nx + 10,
      top: ny - 10,
      bottom: ny + 10,
    };

    const checkPaddleCollision = (paddle: any, y:number) => {
      if (!paddle) return false;
      const paddleRect = {
        left: paddle.x,
        right: paddle.x + paddle.width,
        top: y,
        bottom: y + paddle.height,
      };
      //if (i < 10 && paddle.x < 200)
      //  {
      //    setI(i + 1);
      //    console.log("cords", leftY, rightY)
      //    console.log("ball top ", ballRect.top)
      //    console.log("top ", paddleRect.top)
      //    console.log("ball bottom ", ballRect.bottom)
      //    console.log("bottom ", paddleRect.bottom)
      //    console.log("============================")
      //  }
      return !(
        ballRect.right < paddleRect.left ||
        ballRect.left > paddleRect.right ||
        ballRect.bottom < paddleRect.top ||
        ballRect.top > paddleRect.bottom
      );
    };
    

    if (ball.velX < 0 && checkPaddleCollision(paddleLeft, leftY)) {
      //console.log("entered left");
      
      updateVel("velx");
      localDir.current.x = -localDir.current.x;
      //setDir({ x: localDir.current.x, y: localDir.current.y });
    }
    if (ball.velX > 0 && checkPaddleCollision(paddleRight, rightY)) {
      //console.log("entered right");
      updateVel("velx");
      localDir.current.x = -localDir.current.x;
      //setDir({ x: localDir.current.x, y: localDir.current.y });
    }

    if (nx < -10) {
      onScore("right");
      return;
    }
    if (nx > bounds.width + 10) {
      onScore("left");
      return;
    }
  }, [ball, paddleLeft, paddleRight, bounds, updateVel, onScore, setDir]);

  return (
    <div
      ref={ref}
      className="w-[20px] h-[20px] rounded-full bg-white absolute"
      style={{ left: `${ball.x - 10}px`, top: `${ball.y - 10}px` }}
    />
  );
}
