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

  
  const [ballVel, setBallVel] = useState({ x: 300, y: 120 }); //Ball velocity
  
  const [scoreLeft, setScoreLeft] = useState(0);
  const [scoreRight, setScoreRight] = useState(0);
  
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  
  //useEffect(() => {
	  //	const fetchGameInfo = async () => {
		  //	try {
			  //		const res = await fetch("http://localhost:8088/game");
			  //		if (!res.ok) {
				  //		throw new Error(`HTTP error! status: ${res.status}`);
				  //		}
				  //		const data = await res.json();
				  //		console.log("Game Info from backend:", data);
				  //	} catch (err) {
					  //		console.error("Failed to fetch game info:", err);
					  //	}
					  //	};
					  
					  //	fetchGameInfo();
					  //}, []);
					  
	const [ballPos, setBallPos] = useState({ x: 400, y: 200 }); //Ball position
	useEffect(() => {
		const ws = new WebSocket("ws://localhost:8088/game");
	  
		ws.onopen = () => {
		  console.log("WebSocket Connected!");
		  setWebsocket(ws);
		};
	  
		ws.onmessage = (event) => {
			try {
				const message = JSON.parse(event.data);
				if (message?.game_info?.ball) {
				  const { x, y } = message.game_info.ball;
				  setBallPos({ x, y }); 
				}
			  } catch (err) {
				console.error("Invalid message from server:", event.data);
			  }
	  
		};
	  
		return () => {
		  console.log("Closing WebSocket...");
		  ws.close();
		};
	  }, []);
	  


  const paddleLeft = { x: 24, y: leftY, width: PADDLE_WIDTH, height: PADDLE_HEIGHT };
  const paddleRight = { x: bounds.width - 24 - PADDLE_WIDTH, y: rightY, width: PADDLE_WIDTH, height: PADDLE_HEIGHT };


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