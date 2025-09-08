import type { Ball } from "./Types";

interface BallProps {
  ball: Ball;
}

export default function RBall({
  ball,
}: BallProps) {


  return (
    <div
      className="w-[20px] h-[20px] rounded-full bg-white absolute"
      style={{ left: `${ball.x - 10}px`, top: `${ball.y - 10}px` }}
    />
  );
}
