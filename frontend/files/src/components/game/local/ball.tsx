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
  bodyColor: string;
  shadowColor: string;
}

export default function Ball({
  ballPos,
  bodyColor,
  shadowColor,
  setBallPos,
  ballVel,
  setBallVel,
  paddleLeft,
  paddleRight,
  bounds,
  onScore,
}: BallProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const step = (t: number) => {
      const dt = Math.min(32, t - last) / 1000;
      //console.log("hh", dt)
      last = t;

      let nx = ballPos.x + ballVel.x * dt;
      let ny = ballPos.y + ballVel.y * dt;

      if (ny - 10 <= 0) {
        ny = 10;
        setBallVel({ x: ballVel.x, y: -ballVel.y });
      } else if (ny + 10 >= bounds.height) {
        setBallVel({ x: ballVel.x, y: -ballVel.y });
      }

      const ballRect = { left: nx - 10, right: nx + 10, top: ny - 10, bottom: ny + 10 };

      const checkPaddleCollision = (paddle: any) => {
        if (!paddle) return false;
        const paddleRect = { left: paddle.x, right: paddle.x + paddle.width, top: paddle.y, bottom: paddle.y + paddle.height };
        return !(
          ballRect.right < paddleRect.left ||
          ballRect.left > paddleRect.right ||
          ballRect.bottom < paddleRect.top ||
          ballRect.top > paddleRect.bottom
        );
      };

      if (ballVel.x < 0 && checkPaddleCollision(paddleLeft)) {
        const intersectY = (ny - (paddleLeft!.y + paddleLeft!.height / 2)) / (paddleLeft!.height / 2);
        const speed = Math.hypot(ballVel.x, ballVel.y);
        const newAngle = intersectY * (Math.PI / 3);
        const newSpeed = Math.min(900, speed * 1.1);
        setBallVel({ x: Math.cos(newAngle) * newSpeed, y: Math.sin(newAngle) * newSpeed });
        nx = paddleLeft!.x + paddleLeft!.width + 10;
      }

      if (ballVel.x > 0 && checkPaddleCollision(paddleRight)) {
        const intersectY = (ny - (paddleRight!.y + paddleRight!.height / 2)) / (paddleRight!.height / 2);
        const speed = Math.hypot(ballVel.x, ballVel.y);
        const newAngle = Math.PI - intersectY * (Math.PI / 3);
        const newSpeed = Math.min(900, speed * 1.1);
        setBallVel({ x: Math.cos(newAngle) * newSpeed, y: -Math.sin(newAngle) * newSpeed });
        nx = paddleRight!.x - 10;
      }

      if (nx < -20) {
        onScore("right");
        return;
      }
      if (nx > bounds.width + 20) {
        onScore("left");
        return;
      }

      setBallPos({ x: nx, y: ny });

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [ballPos, ballVel, paddleLeft, paddleRight, bounds]);

  return (
    <div
      ref={ref}
      className="w-[20px] h-[20px] left-[var(--left)] top-[var(--top)] bg-[var(--bodyColor)] shadow-[0_0_10px_var(--shadowColor)] rounded-full absolute"
      style={
        {
          "--bodyColor": bodyColor,
          "--shadowColor": shadowColor,
          "--left": `${ballPos.x - 10}px`,
          "--top": `${ballPos.y - 10}px`,
        } as React.CSSProperties
      }
    />
  );
}
