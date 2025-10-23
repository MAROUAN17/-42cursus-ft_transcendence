import { useEffect, useRef, useState } from "react";
import RBall from "./RBall";
import RBat from "./Bat";
import RHeader from "./RHeader";
import { type GameInfo, type Game, type Round } from "./Types";
import { useNavigate } from "react-router";
import { useUserContext } from "../../contexts/userContext";
import type { gameCustomization } from "../../../types/user";
import api from "../../../axios";
import { useWebSocket } from "../../contexts/websocketContext";
import type { LogPacket } from "../../../types/websocket";
import { v4 as uuidv4 } from "uuid";
import { FaSpinner } from "react-icons/fa";

export default function RGame() {
  //   const [i, setI] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dir, setDir] = useState({ x: 1, y: 1 });
  const [gameInfo, setGameInfo] = useState<GameInfo>();
  const [game, setGame] = useState<Game>();
  const [round, setRound] = useState<Round>();
  const [gameCutomistion, setGameCustomisation] = useState<gameCustomization | undefined>(undefined);

  const [leftY, setLeftY] = useState(140);
  const [rightY, setRightY] = useState(140);
  const [tournamentId, setTournamentId] = useState(0);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [winnerId, setWinnerId] = useState<string>("");
  const navigate = useNavigate();

  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [gameType, setGameType] = useState("");
  const PADDLE_WIDTH = 18;
  const PADDLE_HEIGHT = 120;
  const paddleLeft = { x: 24, y: leftY, width: PADDLE_WIDTH, height: PADDLE_HEIGHT };
  const paddleRight = { x: 600 - 24 - PADDLE_WIDTH, y: rightY, width: PADDLE_WIDTH, height: PADDLE_HEIGHT };
  const [started, setStarted] = useState(false);

  const { user } = useUserContext();
  const { send } = useWebSocket();
  const id = user?.id ? user.id.toString() : "";
  // console.log("------ ",user)

  useEffect(() => {
    api
      .get("/getCustomization", { withCredentials: true })
      .then((res) => {
        setGameCustomisation(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const start_game = (sessionGame: Game) => {
    let interval: NodeJS.Timeout;

    interval = setInterval(() => {
      // console.log("ddddd");

      if (websocket && websocket.readyState === WebSocket.OPEN) {
        // console.log("eeeee");
        websocket.send(
          JSON.stringify({
            type: gameType,
            userId: id,
            gameId: sessionGame.id || "",
            tournamentId: round?.tournament_id,
            roundNumber: round?.round_number ?? 0,
            side: game.side,
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
    // sessionStorage.removeItem("currentGame");
    if (sessionStorage.getItem("currentGame")) {
      storedGame = sessionStorage.getItem("currentGame");
      setGameType("casual");
      console.log("game type seted");
    } else if (sessionStorage.getItem("currentRound")) {
      // console.log("this game from tournament");
      storedGame = sessionStorage.getItem("currentRound");
      setGameType("tournament");
      const userGame = JSON.parse(storedGame);
      setRound(userGame.round);
    } else {
      console.log("No game found in sessionStorage.");
      return;
    }
    // console.log("-- current game", storedGame);

    const sessionGame: Game = JSON.parse(storedGame);
    // if (sessionGame.round.tournament_id) setTournamentId(sessionGame.tournament_id);
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
      if (!gameCutomistion) return;
      if (game?.side == "right") {
        if (down.has("ArrowUp")) setRightY((y) => Math.max(0, y - gameCutomistion?.paddleSpeed));
        if (down.has("ArrowDown")) setRightY((y) => Math.min((gameInfo?.bounds.height ?? 0) - 120, y + gameCutomistion?.paddleSpeed));
      } else if (game?.side == "left") {
        if (down.has("ArrowUp")) setLeftY((y) => Math.max(0, y - gameCutomistion?.paddleSpeed));
        if (down.has("ArrowDown")) setLeftY((y) => Math.min((gameInfo?.bounds.height ?? 0) - 120, y + gameCutomistion?.paddleSpeed));
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
  }, [gameInfo?.bounds.height, gameCutomistion]);

  useEffect(() => {
    if (websocket && websocket.readyState == WebSocket.OPEN) {
      websocket.send(JSON.stringify({ type: "updateY", leftY, rightY, roundId: gameInfo?.roundId, gameId: game.id, side: game.side }));
      console.log(`leftY ${leftY} rightY ${rightY} jj ${game.side}`);
    } else console.log("there is a proble in socket:", websocket);
  }, [leftY, rightY]);

  useEffect(() => {
    if (!gameType || (gameType == "tournament" && !round) || !user) return;
    // console.log(`round : ${round}  gameType: ${gameType}`)

    const ws = new WebSocket(`${import.meta.env.VITE_SOCKET_BACKEND_URL}/game`);
    setWebsocket(ws);
    ws.onopen = () => {
      console.log("WebSocket Connected!");
    };
    ws.onmessage = (event) => {
      // console.log("on Message");
      try {
        const message = JSON.parse(event.data);
        // console.log("msg -> ",message);
        if (message.type === "end") {
          console.log(message);
          console.log("--- game eneded");
          setGameEnded(true);
          setWinnerId(message.winner);
          if ((!round || round.round_number == 2) && message.winner == user?.id) {
            const packet: LogPacket = {
              type: "logNotif",
              data: {
                id: uuidv4(),
                is_removed: false,
                winner: user.username,
                game_type: round ? "tournament" : "1v1",
                score: 100,
                avatar: user.avatar,
                loser: game?.opponent?.username,
                tournament_id: round?.tournament_id,
                timestamps: "2025-10-09 09:11:55",
              },
            };
            console.log("sending -> ", packet);
            send(JSON.stringify(packet));
          }
          // sessionStorage.removeItem("currentGame");
          // sessionStorage.removeItem('currentRound');
          if (round?.tournament_id) navigate(`/bracket/${round.tournament_id}`);
          if (message.type == "updateY") console.log("updateY");
        }
        if (message.type == "game_end") {
          console.log("opponent didnt join");
        }
        if (message.type == "start") setStarted(true);
        setGameInfo(message.game_info);
      } catch (err) {
        console.error("Invalid message from server:", event.data);
      }
    };
    return () => {
      console.log("Closing WebSocket...");
      ws.close();
    };
  }, [gameType, user]);

  useEffect(() => {
    if (!game && !round) return;
    console.log("-- game : ", game);
    console.log("-- round : ", round);
  }, [game, round]);
  useEffect(() => {
    if (!started) console.log(" -- waiting for opponent");
    else console.log("-- game started ");
  });

  // if (!started) return <div>waiting for opponent ... </div>;

  return (
    <>
      {gameEnded ? (
        winnerId === user?.id.toString() ? (
          <div className="transition flex flex-col justify-center items-center bg-compBg rounded-lg w-[700px] h-[600px] absolute top-[23%] left-[37%] text-white text-6xl z-10">
            <img src="victory.png" alt="victory-popup" className="w-[400px]" />
            <div className="flex flex-col items-center gap-3 mt-4">
              <button className="bg-neon text-white text-md text-xl px-12 py-2 rounded-lg font-extrabold" onClick={() => navigate("/pairing")}>
                NEW GAME
              </button>
              <button className="bg-white text-neon text-xl px-12 py-2 rounded-lg font-extrabold" onClick={() => navigate("/dashboard")}>
                BACK HOME
              </button>
            </div>
          </div>
        ) : (
          <div className="transition flex flex-col justify-center items-center bg-compBg rounded-lg w-[700px] h-[600px] absolute top-[23%] left-[37%] text-white text-6xl z-10">
            <img src="lost.png" alt="lost-popup" className="w-[400px]" />
            <div className="flex flex-col items-center gap-3 mt-4">
              <button className="bg-neon text-white text-md text-xl px-12 py-2 rounded-lg font-extrabold" onClick={() => navigate("/pairing")}>
                NEW GAME
              </button>
              <button className="bg-white text-neon text-xl px-12 py-2 rounded-lg font-extrabold" onClick={() => navigate("/dashboard")}>
                BACK HOME
              </button>
            </div>
          </div>
        )
      ) : null}

      <div className={`font-poppins h-screen bg-gameBg flex items-center justify-center ${gameEnded ? "blur-sm pointer-events-none" : null}`}>
        <RHeader
          scoreLeft={gameInfo?.scoreLeft ?? 0}
          scoreRight={gameInfo?.scoreRight ?? 0}
          you={game?.you || round?.player1}
          side={game?.side}
          opponent={game?.opponent || round?.player2}
          gameState={started}
        />

        <div
          ref={containerRef}
          className={`${
            !started ? "blur-sm" : null
          } relative animate-fadeIn [background-image:var(--selected-bg)] border-[var(--borderColor)] shadow-[0_0_10px_var(--shadowColor)] overflow-hidden bg-center bg-cover w-[var(--width)] h-[var(--height)] border-2 rounded-2xl bg-black`}
          style={
            {
              "--selected-bg": `url(${gameCutomistion?.selectedBg})`,
              "--borderColor": gameCutomistion?.gameBorder,
              "--shadowColor": gameCutomistion?.gameShadow,
              "--width": `${game?.gameInfo?.bounds.width ?? 1200}px`,
              "--height": `${game?.gameInfo?.bounds.height ?? 700}px`,
            } as React.CSSProperties
          }
        >
          <RBat
            bodyColor={gameCutomistion?.paddleColor!}
            borderColor={gameCutomistion?.paddleBorder!}
            shadowColor={gameCutomistion?.paddleShadow!}
            x={gameInfo?.paddleLeft.x ?? 24}
            y={gameInfo?.paddleLeft.y ?? 120}
            side="left"
            height={gameInfo?.paddleLeft.height ?? 120}
            containerTop={0}
            containerHeight={gameInfo?.bounds.height ?? 400}
          />
          <RBat
            bodyColor={gameCutomistion?.paddleColor!}
            borderColor={gameCutomistion?.paddleBorder!}
            shadowColor={gameCutomistion?.paddleShadow!}
            x={gameInfo?.paddleLeft.x ?? 24}
            y={gameInfo?.paddleRight.y ?? 120}
            side="right"
            height={gameInfo?.paddleRight.height ?? 120}
            containerTop={0}
            containerHeight={gameInfo?.bounds.height ?? 400}
          />

          <RBall
            bodyColor={gameCutomistion?.ballColor!}
            shadowColor={gameCutomistion?.ballShadow!}
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
