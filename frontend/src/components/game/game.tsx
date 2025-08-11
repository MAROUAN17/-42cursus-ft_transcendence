import  { useEffect, useRef, useState } from "react";
import Bat from "./Bat";
import Ball from "./Ball";
import Header from "./Header";

export default function Game() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [bounds, setBounds] = useState({ width: 800, height: 400 });

  const PADDLE_WIDTH = 18;
  const PADDLE_HEIGHT = 120;

  const [leftY, setLeftY] = useState(140);
  const [rightY, setRightY] = useState(140);

  
  const [ballPos, setBallPos] = useState({ x: 400, y: 200 }); //Ball position
  const [ballVel, setBallVel] = useState({ x: 300, y: 120 }); //Ball velocity

  const [scoreLeft, setScoreLeft] = useState(0);
  const [scoreRight, setScoreRight] = useState(0);

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      setBounds({ width: r.width, height: r.height });
      setLeftY((y) => Math.min(y, r.height - PADDLE_HEIGHT));
      setRightY((y) => Math.min(y, r.height - PADDLE_HEIGHT));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const down = new Set<string>();
    const onKeyDown = (e: KeyboardEvent) => {
      down.add(e.key);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      down.delete(e.key);
    };

    let raf = 0;
    const step = () => {
      if (down.has("ArrowUp")) setRightY((y) => Math.max(0, y - 8));
      if (down.has("ArrowDown")) setRightY((y) => Math.min(bounds.height - PADDLE_HEIGHT, y + 8));
      if (down.has("w") || down.has("W")) setLeftY((y) => Math.max(0, y - 8));
      if (down.has("s") || down.has("S")) setLeftY((y) => Math.min(bounds.height - PADDLE_HEIGHT, y + 8));

      raf = requestAnimationFrame(step);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [bounds.height]);

  const handleScore = (who: "left" | "right") => {
    if (who === "left") setScoreLeft((s) => s + 1);
    else setScoreRight((s) => s + 1);
    setBallPos({ x: bounds.width / 2, y: bounds.height / 2 });
    const angle = (Math.random() * Math.PI / 3) - Math.PI / 6;
    const dir = who === "left" ? -1 : 1;
    setBallVel({ x: dir * 300 * Math.cos(angle), y: 300 * Math.sin(angle) });
  };

  const paddleLeft = { x: 24, y: leftY, width: PADDLE_WIDTH, height: PADDLE_HEIGHT };
  const paddleRight = { x: bounds.width - 24 - PADDLE_WIDTH, y: rightY, width: PADDLE_WIDTH, height: PADDLE_HEIGHT };

  useEffect(() => {
    setBallPos({ x: bounds.width / 2, y: bounds.height / 2 });
    const angle = (Math.random() * Math.PI / 3) - Math.PI / 6;
    const dir = Math.random() > 0.5 ? 1 : -1;
    setBallVel({ x: dir * 300 * Math.cos(angle), y: 300 * Math.sin(angle) });
  }, [bounds.width, bounds.height]);

  return (
    <div className="h-screen bg-gameBg flex items-center justify-center">
      <Header
        scoreLeft={scoreLeft}
        scoreRight={scoreRight}
        leftAvatar="/path/to/player1.png"
        rightAvatar="/path/to/player2.png"
      />

      <div
        ref={containerRef}
        className="relative w-[70%] h-[70%] border-2 border-neon rounded-2xl shadow-neon bg-black"
        style={{ minWidth: 600, minHeight: 360 }}
      >
        <Bat y={leftY} setY={setLeftY} side="left" height={PADDLE_HEIGHT} containerTop={0} containerHeight={bounds.height} />
        <Bat y={rightY} setY={setRightY} side="right" height={PADDLE_HEIGHT} containerTop={0} containerHeight={bounds.height} />

        <Ball
          ballPos={ballPos}
          setBallPos={setBallPos}
          ballVel={ballVel}
          setBallVel={setBallVel}
          paddleLeft={paddleLeft}
          paddleRight={paddleRight}
          bounds={bounds}
          onScore={handleScore}
        />

        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full flex flex-col justify-center items-center">
          <div className="w-0.5 h-8 bg-white opacity-40 mb-6" />
          <div className="w-0.5 h-8 bg-white opacity-40 mb-6" />
          <div className="w-0.5 h-8 bg-white opacity-40 mb-6" />
          <div className="w-0.5 h-8 bg-white opacity-40" />
        </div>
      </div>
    </div>
  );
}