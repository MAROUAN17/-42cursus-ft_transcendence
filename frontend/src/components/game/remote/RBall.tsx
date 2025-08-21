import React, { useEffect, useRef } from "react";
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
}: BallProps) {
  const ref = useRef<HTMLDivElement | null>(null);

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
    const rect = ref?.current?.getBoundingClientRect();
    const ballRect = {
      left: nx - 10,
      right: nx + 10,
      top: ny - 10,
      bottom: ny + 10,
    };

    const checkPaddleCollision = (paddle: any) => {
      if (!paddle) return false;
      const paddleRect = {
        left: paddle.x,
        right: paddle.x + paddle.width,
        top: paddle.y,
        bottom: paddle.y + paddle.height,
      };
      if (paddle.x > 100 && ballRect.right > 600)
        {
          
          console.log("Ball position:", rect?.left, rect?.top);
          console.log("ballRect.right < paddleRect.left: ", ballRect.right , ball.x)
        }
      return !(
        ballRect.right < paddleRect.left ||
        ballRect.left > paddleRect.right ||
        ballRect.bottom < paddleRect.top ||
        ballRect.top > paddleRect.bottom
      );
    };
    

    if (ball.velX < 0 && checkPaddleCollision(paddleLeft)) {
      console.log("entered left");
      
      updateVel("velx");
      localDir.current.x = -localDir.current.x;
      //setDir({ x: localDir.current.x, y: localDir.current.y });
    }
    if (ball.velX > 0 && checkPaddleCollision(paddleRight)) {
      console.log("entered right");
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
