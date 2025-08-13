import  { useEffect, useRef, useState } from "react";
import RBall from "./RBall";
import RBat from "./Bat";
import RHeader from "./RHeader";


export default function RGame() {
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


  return (
	<div className="h-screen bg-gameBg flex items-center justify-center">
	  <RHeader
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
		<RBat y={leftY} setY={setLeftY} side="left" height={PADDLE_HEIGHT} containerTop={0} containerHeight={bounds.height} />
		<RBat y={rightY} setY={setRightY} side="right" height={PADDLE_HEIGHT} containerTop={0} containerHeight={bounds.height} />

		<RBall
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