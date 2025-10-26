import type { Ball } from "./Types";

interface BallProps {
  ball: Ball | {x:number, y:number};
  bodyColor: string;
  shadowColor: string;
}

export default function RBall({ ball, bodyColor, shadowColor }: BallProps) {
  return (
    <div
      className="w-[20px] h-[20px] left-[var(--left)] top-[var(--top)] bg-[var(--bodyColor)] shadow-[0_0_10px_var(--shadowColor)] rounded-full absolute"
      style={
        {
          "--bodyColor": bodyColor,
          "--shadowColor": shadowColor,
          "--left": `${ball.x - 10}px`,
          "--top": `${ball.y - 10}px`,
        } as React.CSSProperties
      }
    />
  );
}
