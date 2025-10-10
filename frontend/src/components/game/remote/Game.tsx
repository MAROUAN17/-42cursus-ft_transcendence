import  { useEffect, useRef, useState } from "react";
import RBall from "./RBall";
import RBat from "./Bat";
import RHeader from "./RHeader";
import { type GameInfo, type  Game, type Round } from "./Types";
import { useWebSocket } from "../../chat/websocketContext";
import { redirect, Route } from "react-router";


export   default function RGame() {
  const [i, setI] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dir, setDir] = useState({x:1, y:1});
  const [gameInfo, setGameInfo] = useState<GameInfo>();
  const [game, setGame] = useState<Game>();
  const [round, setRound] = useState<Round>();

  const [leftY, setLeftY] = useState(140);
  const [rightY, setRightY] = useState(140);
  const [tournamentId, setTournamentId] = useState(1);

  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [gameType, setGameType] = useState("tournament");
  const PADDLE_WIDTH = 18;
  const PADDLE_HEIGHT = 120;
  const paddleLeft = { x: 24, y: leftY, width: PADDLE_WIDTH, height: PADDLE_HEIGHT };
  const paddleRight = { x:  600 - 24 - PADDLE_WIDTH, y: rightY, width: PADDLE_WIDTH, height: PADDLE_HEIGHT };

  const {user} = useWebSocket();
  const id = user?.id ? user.id.toString() : "";


  const start_game = (sessionGame:any) =>
  {
	let interval: NodeJS.Timeout;
  
	interval = setInterval(() => {
		// console.log("session game: ", sessionGame[0].tournament_id)
	//  manageFinalRound(1);
	  if (websocket && websocket.readyState === WebSocket.OPEN) {
		let limit = 2;
		if (round?.round_number == 2)
			limit = 1;
		console.log("-- Limit is: ", round)
		websocket.send(
		  JSON.stringify({
			type: gameType,
			userId: id,
			gameId: sessionGame.id || "",
			tournamentId: tournamentId,
			limit: limit,
		  })
		);
		console.log("Game sent to server ✅: ", user?.id);
		clearInterval(interval);
	  } else {
		// console.log("⏳ Waiting for socket...");
	  }
	}, 1000);
  
	return () => clearInterval(interval);
  }
  useEffect(() => {
	var storedGame = null;
	//for testing round
	// sessionStorage.removeItem('currentGame');
	if (sessionStorage.getItem("currentGame") ) {
		storedGame = sessionStorage.getItem("currentGame") ;
		setGameType("casual");
		console.log("game type seted");
	}
	else {
		console.log("this game from tournament");
		storedGame = sessionStorage.getItem("currentRound") ;
		const rounds = JSON.parse(storedGame);

		const userRound = rounds.find(
			(r:Round) => r.player1 === Number(id) || r.player2 === Number(id)
		);
		
		if (userRound) {
			setTournamentId(userRound.tournament_id);
			setRound(userRound);
			console.log("User Round Found", userRound);
		} else {
			console.warn("User is not part of any round.");
		}
	}
	if (!storedGame) {
	  console.log("No game found in sessionStorage.");
	  return;
	}
	console.log("current game", storedGame)
  
	const sessionGame = JSON.parse(storedGame);
	if (sessionGame.tournament_id)
			setTournamentId(sessionGame.tournament_id);
	setGame(sessionGame);
	start_game(sessionGame);
	
  }, [websocket]);

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
		if (game?.side == "right" || Number(id) == round?.player1) {
		  if (down.has("ArrowUp")) setRightY((y) => Math.max(0, y - 8));
		  if (down.has("ArrowDown")) setRightY((y) => Math.min((gameInfo?.bounds.height ?? 0) - 120, y + 8));
	  } else if (game?.side == "left" || Number(id) == round?.player2) {
		if (down.has("ArrowUp")) setLeftY((y) => Math.max(0, y - 8));
		  if (down.has("ArrowDown")) setLeftY((y) => Math.min((gameInfo?.bounds.height ?? 0) - 120, y + 8));
	  }
    //   if (down.has("ArrowUp")) setRightY((y) => Math.max(0, y - 8));
    //   if (down.has("ArrowDown")) setRightY((y) => Math.min((gameInfo?.bounds.height ?? 0) - 120, y + 8));
    //   if (down.has("w") || down.has("W")) setLeftY((y) => Math.max(0, y - 8));
    //   if (down.has("s") || down.has("S")) setLeftY((y) => Math.min((gameInfo?.bounds.height ?? 0) - 120, y + 8));

	  
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
		// console.log("RoundId :", gameInfo?.roundId);
		// if (Number(id) == round?.player2)
		// 		setLeftY(gameInfo?.paddleLeft.y || 0)
		// else
		// 	setRightY(gameInfo?.paddleRight.y || 0);
		if (websocket && websocket.readyState == WebSocket.OPEN){
			websocket.send(JSON.stringify({ type: "updateY", leftY, rightY, roundId:gameInfo?.roundId}));
			//console.log("message sent [DIR]: ", type);
		} else
			console.log("there is a proble in socket:", websocket);
	}, [leftY, rightY]);

	const manageFinalRound = async (winner:number) => {
		if (gameType != "tournament")
				return ;
		console.log("trying to fetch final round ", gameType)
		if (Number(id) && winner != Number(id)){
			// redirect("/tournaments");
			alert(`you lose the game winner is :", ${winner}`);
			return ;
		}
		try {
         const response = await fetch(`https://localhost:4000/tournament/final_round/${tournamentId}`);
         if (response.ok) {
           const finalROund = await response.json();
		   setRound(finalROund)
           console.log("Final Round fetched: ", finalROund);
         } else {
           console.log("still waiting for players ...");
         }
      } catch (error) {
        console.error("Error fetching tournament:", error);
      }
	}
	//receiving game info
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
				if (message.type === "end")
				{
					sessionStorage.removeItem('currentGame');
					manageFinalRound(Number(message.winner));
				}
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
		you = {game?.you  || round?.player1}
		side = {game?.side}
		opponent = {game?.opponent || round?.player2}
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