import  { useEffect, useRef, useState } from "react";
import RBall from "./RBall";
import RBat from "./Bat";
import RHeader from "./RHeader";
import { type GameInfo } from "./Types";

export default function RGame() {
   const [i, setI] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dir, setDir] = useState({x:1, y:1});
  const [gameInfo, setGameInfo] = useState<GameInfo>()

  const [leftY, setLeftY] = useState(140);
  const [rightY, setRightY] = useState(140);

  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const PADDLE_WIDTH = 18;
  const PADDLE_HEIGHT = 120;
  const paddleLeft = { x: 24, y: leftY, width: PADDLE_WIDTH, height: PADDLE_HEIGHT };
  const paddleRight = { x:  800 - 24 - PADDLE_WIDTH, y: rightY, width: PADDLE_WIDTH, height: PADDLE_HEIGHT };
  var x = 0;
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
      if (down.has("ArrowDown")) setRightY((y) => Math.min(gameInfo?.bounds.height ?? 0 - 120, y + 8));
      if (down.has("w") || down.has("W")) setLeftY((y) => Math.max(0, y - 8));
      if (down.has("s") || down.has("S")) setLeftY((y) => Math.min(gameInfo?.bounds.height ?? 0 - 120, y + 8));

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
  }, [gameInfo?.bounds.height]);

	useEffect(() => {
		const ws = new WebSocket("ws://localhost:8088/game");
		setWebsocket(ws);
		ws.onopen = () => {
		  console.log("WebSocket Connected!");
		};
	  
		ws.onmessage = (event) => {
			try {
				const message = JSON.parse(event.data);
				setGameInfo(message.game_info);
				if (!x) {
					setDir({
						x: (gameInfo?.ball?.velX ?? 0) >= 0 ? 1 : -1,
						y: (gameInfo?.ball?.velY ?? 0) >= 0 ? 1 : -1,
					});
					x =1;
				}
			} catch (err) {
				console.error("Invalid message from server:", event.data);
			}
		};
	  
		return () => {
		  console.log("Closing WebSocket...");
		  ws.close();
		};
	  }, [60/1000]);
	//  useEffect(() => {
	//	setI(i + 1)
	//	if (websocket && websocket.readyState == WebSocket.OPEN)
	//	{
	//		websocket.send(JSON.stringify({ type: "dirUpdate", dir }));
	//		//console.log("message sent [DIR]: ", dir, i);
	//	}
	//	else
	//		console.log("there is a proble in socket:", websocket);
	//  }, [dir]);
	  const updateVel= ( type:string) =>
	  {
		if (websocket && websocket.readyState == WebSocket.OPEN){
			if (type == "vely")
				websocket.send(JSON.stringify({ type: "vely"}));
			if (type == "velx")
				websocket.send(JSON.stringify({ type: "vely"}));
			console.log("message sent [DIR]: ", type);
		} else {
			console.log("there is a proble in socket:", websocket);
		}

	  }
	  const handleScore = (who: "left" | "right") => {
		if (websocket && websocket.readyState == WebSocket.OPEN)
		{
			websocket.send(JSON.stringify({type: "score", who}));
			//console.log("message sent [score]: ", dir);
		}
		else
			console.log("there is a proble in socket:", websocket);
	  };

  return (
	<div className="h-screen bg-gameBg flex items-center justify-center">
	  <RHeader
		scoreLeft={gameInfo?.scoreLeft ?? 0}
		scoreRight={gameInfo?.scoreRight ?? 0}
		leftAvatar="/path/to/player1.png"
		rightAvatar="/path/to/player2.png"
	  />

	  <div
		ref={containerRef}
		className="relative  border-2 border-neon rounded-2xl shadow-neon bg-black"
		style={{ minWidth: 600, minHeight: 360, height:gameInfo?.bounds.height, width:gameInfo?.bounds.width }}
	  >
		<RBat y={leftY} setY={setLeftY} side="left" height={gameInfo?.paddleLeft.height ?? 0} containerTop={0} containerHeight={gameInfo?.bounds.height ?? 400} />
		<RBat y={rightY} setY={setRightY} side="right" height={gameInfo?.paddleLeft.height ?? 0} containerTop={0} containerHeight={gameInfo?.bounds.height ?? 400} />

		<RBall
		  dir={dir}
		  setDir={setDir}
		  ball={gameInfo?.ball ?? {x:0,y:0}}
		  paddleLeft={paddleLeft}
		  paddleRight={paddleRight}
		  bounds={gameInfo?.bounds ?? {width:800, height:400}}
		  onScore={handleScore}
		  updateVel={updateVel}
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