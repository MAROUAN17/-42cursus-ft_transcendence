import { useEffect, useRef, useState } from "react";
import RBall from "./RBall";
import RBat from "./Bat";
import RHeader from "./RHeader";
import { type GameInfo, type Game, type Round } from "./Types";
import { useNavigate } from "react-router";
import { useUserContext } from "../../contexts/userContext";

export default function RGame() {
  //   const [i, setI] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dir, setDir] = useState({ x: 1, y: 1 });
  const [gameInfo, setGameInfo] = useState<GameInfo>();
  const [game, setGame] = useState<Game>();
  const [round, setRound] = useState<Round>();

  const [leftY, setLeftY] = useState(140);
  const [rightY, setRightY] = useState(140);
  const [tournamentId, setTournamentId] = useState(0);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [winnerId, setWinnerId] = useState<string>("");

  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [gameType, setGameType] = useState("");
  const PADDLE_WIDTH = 18;
  const PADDLE_HEIGHT = 120;
  const paddleLeft = { x: 24, y: leftY, width: PADDLE_WIDTH, height: PADDLE_HEIGHT };
  const paddleRight = { x: 600 - 24 - PADDLE_WIDTH, y: rightY, width: PADDLE_WIDTH, height: PADDLE_HEIGHT };
  const [roundNumber, setRounNumber] = useState(2);
  //   const [id, setId] = useState(0);

  const { user } = useUserContext();
  const id = user?.id ? user.id.toString() : "";
  // console.log("------ ",user)
  const navigate = useNavigate();
  const start_game = (sessionGame: any) => {
    let interval: NodeJS.Timeout;

    interval = setInterval(() => {
      // console.log("ddddd");
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        console.log("eeeee");
        websocket.send(
          JSON.stringify({
            type: gameType,
            userId: id,
            gameId: sessionGame.id || "",
            tournamentId: tournamentId,
            roundNumber: sessionGame.round_number,
          })
        );
        console.log("Game sent to server ✅: ", user, id);
        clearInterval(interval);
      } else {
        // console.log("⏳ Waiting for socket...");
      }
    }, 1000);

    return () => clearInterval(interval);
  };
  useEffect(() => {
    var storedGame = null;
    //for testing round
    // sessionStorage.removeItem("currentGame");
    if (sessionStorage.getItem("currentGame")) {
      storedGame = sessionStorage.getItem("currentGame");
      setGameType("casual");
      console.log("game type seted");
    } else {
      console.log("this game from tournament");
      storedGame = sessionStorage.getItem("currentRound");
      setGameType("tournament");
      const userRound = JSON.parse(storedGame);
      setRound(userRound);
    }
    if (!storedGame) {
      console.log("No game found in sessionStorage.");
      return;
    }
    console.log("current game", storedGame);

    const sessionGame = JSON.parse(storedGame);
    if (sessionGame.tournament_id) setTournamentId(sessionGame.tournament_id);
    setGame(sessionGame);
    start_game(sessionGame);
  }, [websocket, user, tournamentId]);

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
    if (websocket && websocket.readyState == WebSocket.OPEN) {
      websocket.send(JSON.stringify({ type: "updateY", leftY, rightY, roundId: gameInfo?.roundId, gameId: game.id, side: game.side }));
      console.log(`leftY ${leftY} rightY ${rightY}`);
    } else console.log("there is a proble in socket:", websocket);
  }, [leftY, rightY]);

  useEffect(() => {
    // console.log(`id : ${tournamentId}  gameType: ${gameType}`)
    if (gameType == "tournament" && !tournamentId) return;
    console.log("user -> ");
    const ws = new WebSocket("wss://localhost:5000/game");
    setWebsocket(ws);
    console.log("web socket ===== ", ws);
    ws.onopen = () => {
      console.log("WebSocket Connected!");
    };
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "end") {
          console.log(message);
          console.log("--- game eneded");
          setGameEnded(true);
          setWinnerId(message.winner);
          // sessionStorage.removeItem("currentGame");
          // sessionStorage.removeItem('currentRound');
          sessionStorage.setItem("roundNb", "2");
          if (tournamentId) navigate(`/bracket/${tournamentId}`);
          if (message.type == "updateY") console.log("updateY");
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
  }, [tournamentId]);

  return (
    <>
     {gameEnded ? (
      winnerId === user?.id.toString() ? 
        (<div className="transition flex flex-col justify-center items-center bg-compBg rounded-lg w-[700px] h-[600px] absolute top-[23%] left-[37%] text-white text-6xl z-10">
          <img src="victory.png" alt="victory-popup" className="w-[400px]" />
          <div className="flex flex-col items-center gap-3 mt-4">
            <button className="bg-neon text-white text-md text-xl px-12 py-2 rounded-lg font-extrabold">NEW GAME</button>
            <button className="bg-white text-neon text-xl px-12 py-2 rounded-lg font-extrabold">BACK HOME</button>
          </div>
        </div>) : 
        (<div className="transition flex flex-col justify-center items-center bg-compBg rounded-lg w-[700px] h-[600px] absolute top-[23%] left-[37%] text-white text-6xl z-10">
          <img src="lost.png" alt="lost-popup" className="w-[400px]" />
          <div className="flex flex-col items-center gap-3 mt-4">
            <button className="bg-neon text-white text-md text-xl px-12 py-2 rounded-lg font-extrabold">NEW GAME</button>
            <button className="bg-white text-neon text-xl px-12 py-2 rounded-lg font-extrabold">BACK HOME</button>
          </div>
        </div>)) : null}
        
      <div className={`font-poppins h-screen bg-gameBg flex items-center justify-center ${gameEnded ? "blur-sm pointer-events-none" : null}`}>
        <RHeader
          scoreLeft={gameInfo?.scoreLeft ?? 0}
          scoreRight={gameInfo?.scoreRight ?? 0}
          you={game?.you || round?.player1}
          side={game?.side}
          opponent={game?.opponent || round?.player2}
        />

        <div
          ref={containerRef}
          className="relative border-2 border-neon rounded-2xl shadow-neon bg-black"
          style={{
            minWidth: 600,
            minHeight: 360,
            height: gameInfo?.bounds.height,
            width: gameInfo?.bounds.width,
          }}
        >
          <RBat
            x={gameInfo?.paddleLeft.x ?? 24}
            y={gameInfo?.paddleLeft.y ?? 120}
            side="left"
            height={gameInfo?.paddleLeft.height ?? 120}
            containerTop={0}
            containerHeight={gameInfo?.bounds.height ?? 400}
          />
          <RBat
            x={gameInfo?.paddleLeft.x ?? 24}
            y={gameInfo?.paddleRight.y ?? 120}
            side="right"
            height={gameInfo?.paddleRight.height ?? 120}
            containerTop={0}
            containerHeight={gameInfo?.bounds.height ?? 400}
          />

          <RBall
            dir={dir}
            setDir={setDir}
            ball={gameInfo?.ball ?? { x: 300, y: 180 }}
            paddleLeft={gameInfo?.paddleLeft ?? paddleLeft}
            paddleRight={gameInfo?.paddleRight ?? paddleRight}
            bounds={gameInfo?.bounds ?? { width: 600, height: 400 }}
          />

          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full flex flex-col justify-center items-center">
            <div className="w-0.5 h-8 bg-white opacity-40 mb-6" />
            <div className="w-0.5 h-8 bg-white opacity-40 mb-6" />
            <div className="w-0.5 h-8 bg-white opacity-40 mb-6" />
            <div className="w-0.5 h-8 bg-white opacity-40" />
          </div>
        </div>
      </div>
    </>
  );
}
