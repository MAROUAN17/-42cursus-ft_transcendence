import  { useEffect, useRef, useState } from "react";
import RBall from "./RBall";
import RBat from "./Bat";
import RHeader from "./RHeader";
import { type GameInfo, type  Game } from "./Types";
import { useWebSocket } from "../../chat/websocketContext";


export   default function RGame() {
  const [i, setI] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dir, setDir] = useState({x:1, y:1});
  const [gameInfo, setGameInfo] = useState<GameInfo>();
  const [game, setGame] = useState<Game>();

  const [leftY, setLeftY] = useState(140);
  const [rightY, setRightY] = useState(140);

  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const PADDLE_WIDTH = 18;
  const PADDLE_HEIGHT = 120;
  const paddleLeft = { x: 24, y: leftY, width: PADDLE_WIDTH, height: PADDLE_HEIGHT };
  const paddleRight = { x:  600 - 24 - PADDLE_WIDTH, y: rightY, width: PADDLE_WIDTH, height: PADDLE_HEIGHT };

  const {user} = useWebSocket();
const id = user?.id ? user.id.toString() : "";
  useEffect(() => {
	const storedGame = sessionStorage.getItem("currentGame");
	if (!storedGame) {
	  console.log("No game found in sessionStorage.");
	  return;
	}
  
	const sessionGame = JSON.parse(storedGame);
	setGame(sessionGame);
  
	let interval: NodeJS.Timeout;
  
	interval = setInterval(() => {
	  if (websocket && websocket.readyState === WebSocket.OPEN) {
		websocket.send(
		  JSON.stringify({
			type: "newGame",
			userId: id,
			gameId: sessionGame.id,
		  })
		);
		console.log("Game sent to server ✅");
		clearInterval(interval);
	  } else {
		console.log("⏳ Waiting for socket...");
	  }
	}, 1000);
  
	return () => clearInterval(interval);
  }, [websocket]);
  useEffect(() => {
	if (i < 3)
		{
			console.log("session game ", game)
			setI(i + 1);
		}
  }, [game])
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
	  if (game?.side == "right") {
		  if (down.has("ArrowUp")) setRightY((y) => Math.max(0, y - 8));
		  if (down.has("ArrowDown")) setRightY((y) => Math.min((gameInfo?.bounds.height ?? 0) - 120, y + 8));
	  } else if (game?.side == "left") {
		if (down.has("ArrowUp")) setLeftY((y) => Math.max(0, y - 8));
		  if (down.has("ArrowDown")) setLeftY((y) => Math.min((gameInfo?.bounds.height ?? 0) - 120, y + 8));
	  }
	//  if (down.has("ArrowUp")) setRightY((y) => Math.max(0, y - 8));
	//  if (down.has("ArrowDown")) setRightY((y) => Math.min((gameInfo?.bounds.height ?? 0) - 120, y + 8));
    //  if (down.has("w") || down.has("W")) setLeftY((y) => Math.max(0, y - 8));
    //  if (down.has("s") || down.has("S")) setLeftY((y) => Math.min((gameInfo?.bounds.height ?? 0) - 120, y + 8));
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

	useEffect ( () => {
		if (websocket && websocket.readyState == WebSocket.OPEN)
			websocket.send(JSON.stringify({ type: "updateY", leftY, rightY, gameId:game?.id}));
		else
			console.log("there is a proble in socket:", websocket);
	}, [leftY, rightY]);

	useEffect(() => {
		const ws = new WebSocket("wss://localhost:4000/game");
		setWebsocket(ws);
		console.log('web socket ===== ', ws)
		ws.onopen = () => {
		  console.log("WebSocket Connected!");
		};
		ws.onmessage = (event) => {
			try {
				const message = JSON.parse(event.data);
				setGameInfo(message.game_info);
			} catch (err) {
				console.error("Invalid message from server:", event.data);
			}
		};
		return () => {
		  console.log("Closing WebSocket...");
		  ws.close();
		};
	  }, []);

  return (
	<div className="h-screen bg-gameBg flex items-center justify-center">
	  <RHeader
		scoreLeft={gameInfo?.scoreLeft ?? 0}
		scoreRight={gameInfo?.scoreRight ?? 0}
		you = {game?.you }
		side = {game?.side}
		opponent = {game?.opponent}
	  />

	  <div
		ref={containerRef}
		className="relative  border-2 border-neon rounded-2xl shadow-neon bg-black"
		style={{ minWidth: 600, minHeight: 360, height:gameInfo?.bounds.height, width:gameInfo?.bounds.width }}
	  >
		<RBat  x={gameInfo?.paddleLeft.x ?? 24} y={gameInfo?.paddleLeft.y ?? 0} side="left" height={gameInfo?.paddleLeft.height ?? 0} containerTop={0} containerHeight={gameInfo?.bounds.height ?? 400} />
		<RBat x={gameInfo?.paddleLeft.x ?? 600 - 24 - 18} y={gameInfo?.paddleRight.y ?? 0} side="right" height={gameInfo?.paddleRight.height ?? 0} containerTop={0} containerHeight={gameInfo?.bounds.height ?? 400} />

		<RBall
		  dir={dir}
		  setDir={setDir}
		  ball={gameInfo?.ball ?? {x:0,y:0}}
		  paddleLeft={gameInfo?.paddleLeft ?? paddleLeft}
		  paddleRight={gameInfo?.paddleRight ?? paddleRight}
		  bounds={gameInfo?.bounds ?? {width:600, height:400}}
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