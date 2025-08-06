import { useRef, useEffect, useState } from "react";
import Bat1 from "./bat1";
import Bat2 from "./bat2";
import Ball from "./ball";

export interface GameBounds {
  width: number;
  height: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
}

function Game() {
  const gameRef = useRef<HTMLDivElement | null>(null);
  const [gameBounds, setGameBounds] = useState<GameBounds | null>(null);
  const [cords, setCords] = useState({ x: 100, y: 100 });

  useEffect(() => {
    const updateBounds = () => {
      if (gameRef.current) {
        const rect = gameRef.current.getBoundingClientRect();
        const newBounds: GameBounds = {
          width: rect.width,
          height: rect.height,
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
        };
  
        setGameBounds(prev => {
          if (
            !prev ||
            prev.width !== newBounds.width ||
            prev.height !== newBounds.height ||
            prev.top !== newBounds.top ||
            prev.bottom !== newBounds.bottom ||
            prev.left !== newBounds.left ||
            prev.right !== newBounds.right
          ) {
            return newBounds;
          }
          return prev; 
        });
      }
    };
  
    updateBounds(); 
  
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, []);
  return (
    <div className="h-screen bg-gameBg flex justify-center">
        {/*just for testing*/}
        <div className="absolute top-4 left-4 bg-black bg-opacity-70 rounded p-3 text-green-400 font-mono text-xs shadow-md z-50">
            {gameBounds ? (
                <div>
                <div>Width: {gameBounds.width.toFixed(0)}px</div>
                <div>Height: {gameBounds.height.toFixed(0)}px</div>
                <div>Top: {gameBounds.top.toFixed(0)}px</div>
                <div>Bottom: {gameBounds.bottom.toFixed(0)}px</div>
                <div>Left: {gameBounds.left.toFixed(0)}px</div>
                <div>Right: {gameBounds.right.toFixed(0)}px</div>
                <span>---------------------Ball Info-------------------------</span>
                <div>X: {cords.x.toFixed(0)}px</div>
                <div>Y: {cords.y.toFixed(0)}px</div>
                </div>
            ) : (
                <div>Calculating bounds...</div>
            )}
        </div>
        
      <div
        ref={gameRef}
        className="flex justify-between items-center relative mt-52 w-[70%] h-[70%] border-2 border-neon rounded-2xl shadow-neon shadow-[0_0px_50px_rgba(0,0,0,0.3)] bg-black"
      >
        <Bat1 />
        {gameBounds && <Ball gameBounds={gameBounds} cords={cords} updateCords={setCords} />}
        <Bat2 />
      </div>
    </div>
  );
}

export default Game;
