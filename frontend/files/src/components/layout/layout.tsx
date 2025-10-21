import React, { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import api from "../../axios";
import { useWebSocket } from "../contexts/websocketContext";
import { FaSpinner } from "react-icons/fa";
import { useUserContext } from "../contexts/userContext";
import type { EventPacket, websocketPacket } from "../../types/websocket";

function Layout() {
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [gameBorder, setGameBorder] = useState("#B13BFF");
  const [gameShadow, setGameShadow] = useState("#B13BFF");
  const [ballColor, setBallColor] = useState("#B13BFF");
  const [ballShadow, setBallShadow] = useState("#B13BFF");
  const [paddleColor, setPaddleColor] = useState("#ffffff");
  const [paddleBorder, setPaddleBorder] = useState("#B13BFF");
  const [paddleShadow, setPaddleShadow] = useState("#B13BFF");
  const [paddleSpeed, setPaddleSpeed] = useState("2");
  const [selectedBg, setSelectedBg] = useState("/gameBg1.jpg");

  const [countDown, setCountDown] = useState<number>(5);
  const tournamentId = useRef<number | undefined>(undefined);
  const tournamentAdmin = useRef<number | undefined>(undefined);
  // delete later
  const { user } = useUserContext();
  //////
  const { gameInvite, setGameInvite, opponentName, setOpponentName, addHandler } = useWebSocket();

  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const handler = addHandler("gameEvent", eventHandler);
    return handler;
  }, []);

  useEffect(() => {
    if (!gameInvite) return;
    const timer = setInterval(() => {
      setCountDown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (gameInvite == "tournamentStart" && tournamentId.current && tournamentAdmin.current) {
            if (!location.pathname.includes("bracket/")) navigate(`bracket/${tournamentId.current}`);
            else {
              // navigate("/remote_game");
              window.location.reload();
            }

            // window.location.reload();
          } else if (gameInvite != "tournamentStart") {
            api
              .get(`/match/my-game/${user?.id.toString()}`, { withCredentials: true })
              .then((res) => {
                sessionStorage.setItem("currentGame", JSON.stringify(res.data.game));
                navigate("/remote_game");
              })
              .catch((err) => {
                console.error("err getting game ----------------------> ", err);
              });
          }
          setCountDown(5);
          tournamentId.current = undefined;
          setGameInvite(undefined);
          setOpponentName(undefined);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameInvite, user]);

  function eventHandler(packet: websocketPacket) {
    if (packet.type != "gameEvent") return;
    console.log("got packt -> ", packet);
    setGameInvite("tournamentStart");
    setOpponentName((prev: string | undefined) => (prev ? prev : packet.data.tournamentName));
    tournamentId.current = packet.data.tournamentId;
    tournamentAdmin.current = packet.data.admin;
  }

  function fetchData() {
    api
      .get("/getCustomization", { withCredentials: true })
      .then((res) => {
        setGameBorder(res.data.gameBorder);
        setGameShadow(res.data.gameShadow);
        setBallColor(res.data.ballColor);
        setBallShadow(res.data.ballShadow);
        setPaddleColor(res.data.paddleColor);
        setPaddleBorder(res.data.paddleBorder);
        setPaddleShadow(res.data.paddleShadow);
        setPaddleSpeed((res.data.paddleSpeed - 6).toString());
        setSelectedBg(res.data.selectedBg);
      })
      .catch((err) => {
        console.log("err -> ", err);
      });
  }
  function updateData() {
    api.post(
      "/updateCustomization",
      { gameBorder, gameShadow, ballColor, ballShadow, paddleColor, paddleBorder, paddleShadow, paddleSpeed, selectedBg },
      { withCredentials: true }
    );
  }

  return (
    <>
      {gameInvite == "recipient" ? (
        <div
          className={`absolute gap-3 p-6 animate-fadeIn font-poppins flex flex-col justify-center items-center text-white rounded-[20px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-[#14095c] w-1/4 h-fit`}
        >
          <div className="relative w-fit h-fit">
            <h1 className="absolute top-1/2 left-1/2 font-bold -translate-x-1/2 -translate-y-1/2 text-[28px]">{countDown}</h1>
            <FaSpinner className="animate-[spin_1.3s_linear_infinite] w-[60px] h-[60px]" />
          </div>
          <h1 className="font-semibold text-center text-[25px]">
            Your Game with <span className="font-bold text-neon">{opponentName}</span> will Start Soon...
          </h1>
        </div>
      ) : gameInvite == "tournamentStart" ? (
        <div
          className={`absolute gap-3 p-6 animate-fadeIn font-poppins flex flex-col justify-center items-center text-white rounded-[20px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-[#14095c] w-1/4 h-fit`}
        >
          <div className="relative w-fit h-fit">
            <h1 className="absolute top-1/2 left-1/2 font-bold -translate-x-1/2 -translate-y-1/2 text-[28px]">{countDown}</h1>
            <FaSpinner className="animate-[spin_1.3s_linear_infinite] w-[60px] h-[60px]" />
          </div>
          <h1 className="font-semibold text-center text-[25px]">
            Your Game in The Tournament <span className="font-bold text-neon">{opponentName}</span> will Start Soon...
          </h1>
        </div>
      ) : gameInvite == "sender" ? (
        <div
          className={`absolute gap-3 p-6 animate-fadeIn font-poppins flex flex-col justify-center items-center text-white rounded-[20px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-[#14095c] w-1/4 h-fit`}
        >
          <div className="relative w-fit h-fit">
            <h1 className="absolute top-1/2 left-1/2 font-bold -translate-x-1/2 -translate-y-1/2 text-[28px]">{countDown}</h1>
            <FaSpinner className="animate-[spin_1.3s_linear_infinite] w-[60px] h-[60px]" />
          </div>
          <h1 className="font-semibold text-center text-[25px]">
            Waiting for <span className="font-bold text-neon">{opponentName}</span> to join...
          </h1>
        </div>
      ) : null}
      {settingsOpen ? (
        <div
          className={`absolute p-6 animate-fadeIn font-poppins flex flex-col justify-center items-center text-white rounded-[20px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-[#14095c] w-1/3 h-fit`}
        >
          <div className="h-full w-full">
            <h1 className="font-bold text-[25px] mb-2">Game Customizations</h1>
            <hr />
            <div className="py-5">
              <div className="font-bold flex items-center text-[18px] mb-2">
                <h2 className="w-[160px]">Game Border:</h2>
                <hr className="w-full" />
              </div>
              <div className="flex gap-5">
                <div className="flex flex-col gap-3">
                  <h2 className="w-[210px]">Game's Border Color: </h2>
                  <h2 className="w-[210px]">Game's Shadow Color: </h2>
                </div>
                <div className="flex flex-col ml-16 gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={gameBorder}
                      onChange={(e) => {
                        setGameBorder(e.target.value);
                      }}
                      className="rounded-sm overflow-hidden border-4 bg-white"
                    />
                    <h2>{gameBorder}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={gameShadow}
                      onChange={(e) => {
                        setGameShadow(e.target.value);
                      }}
                      className="rounded-sm overflow-hidden border-4 bg-white"
                    />
                    <h2>{gameShadow}</h2>
                  </div>
                </div>
              </div>
              <div className="font-bold flex items-center text-[18px] my-2">
                <h2 className="w-[115px]">Ball Color:</h2>
                <hr className="w-full" />
              </div>
              <div className="flex items-center gap-5">
                <div className="flex flex-col gap-3">
                  <h2 className="w-[210px]">Ball's Color: </h2>
                  <h2 className="w-[210px]">Ball's Shadow Color: </h2>
                </div>
                <div className="flex flex-col ml-16 gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={ballColor}
                      onChange={(e) => {
                        setBallColor(e.target.value);
                      }}
                      className="rounded-sm overflow-hidden border-4 bg-white"
                    />
                    <h2>{ballColor}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={ballShadow}
                      onChange={(e) => {
                        setBallShadow(e.target.value);
                      }}
                      className="rounded-sm overflow-hidden border-4 bg-white"
                    />
                    <h2>{ballShadow}</h2>
                  </div>
                </div>
                <div
                  className={`w-[40px] h-[40px] ml-16 rounded-full bg-[var(--ball-color)] shadow-[0_0px_15px_var(--ball-shadow)]`}
                  style={{ "--ball-color": ballColor, "--ball-shadow": ballShadow } as React.CSSProperties}
                ></div>
              </div>
              <div className="font-bold flex items-center text-[18px] my-2">
                <h2 className="w-[160px]">Paddle Color:</h2>
                <hr className="w-full" />
              </div>
              <div className="flex items-center gap-5">
                <div className="flex flex-col gap-3">
                  <h2 className="w-[210px]">Paddle's Color: </h2>
                  <h2 className="w-[210px]">Paddle's Border: </h2>
                  <h2 className="w-[210px]">Paddle's Shadow Color: </h2>
                </div>
                <div className="flex flex-col ml-16 gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={paddleColor}
                      onChange={(e) => {
                        setPaddleColor(e.target.value);
                      }}
                      className="rounded-sm overflow-hidden border-4 bg-white"
                    />
                    <h2>{paddleColor}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={paddleBorder}
                      onChange={(e) => {
                        setPaddleBorder(e.target.value);
                      }}
                      className="rounded-sm overflow-hidden border-4 bg-white"
                    />
                    <h2>{paddleBorder}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={paddleShadow}
                      onChange={(e) => {
                        setPaddleShadow(e.target.value);
                      }}
                      className="rounded-sm overflow-hidden border-4 bg-white"
                    />
                    <h2>{paddleShadow}</h2>
                  </div>
                </div>
                <div
                  className="w-[15px] h-[105px] ml-20 border-4 border-[var(--paddle-border)] rounded-xl shadow-[0_0px_15px_var(--paddle-shadow)] bg-[var(--paddle-color)]"
                  style={{ "--paddle-color": paddleColor, "--paddle-border": paddleBorder, "--paddle-shadow": paddleShadow } as React.CSSProperties}
                ></div>
              </div>

              <div className="font-bold flex items-center text-[18px] my-2">
                <h2 className="w-[160px]">Paddle Speed:</h2>
                <hr className="w-full" />
              </div>
              <div className="flex gap-6">
                <h2 className="w-[210px]">
                  Current Speed: <span className="font-bold text-neon">{paddleSpeed}</span>
                </h2>
                <input
                  type="range"
                  value={paddleSpeed}
                  onChange={(e) => setPaddleSpeed(e.target.value)}
                  min={1}
                  max={6}
                  className="accent-neon w-[380px] ml-16"
                />
              </div>
              <div className="font-bold flex items-center text-[18px] my-2">
                <h2 className="w-[270px]">Game's Background:</h2>
                <hr className="w-full" />
              </div>
              <div className="flex flex-wrap gap-6">
                <img
                  src="/gameBg1.jpg"
                  onClick={() => setSelectedBg("/gameBg1.jpg")}
                  className={`w-[250px] p-1 ${selectedBg == "/gameBg1.jpg" ? "bg-neon" : "bg-white"} rounded-lg h-[150px]`}
                />
                <img
                  src="/gameBg2.jpg"
                  onClick={() => setSelectedBg("/gameBg2.jpg")}
                  className={`w-[250px] p-1 ${selectedBg == "/gameBg2.jpg" ? "bg-neon" : "bg-white"} rounded-lg h-[150px]`}
                />
                <img
                  src="/gameBg3.jpg"
                  onClick={() => setSelectedBg("/gameBg3.jpg")}
                  className={`w-[250px] p-1 ${selectedBg == "/gameBg3.jpg" ? "bg-neon" : "bg-white"} rounded-lg h-[150px]`}
                />
                <img
                  src="/gameBg4.jpg"
                  onClick={() => setSelectedBg("/gameBg4.jpg")}
                  className={`w-[250px] p-1 ${selectedBg == "/gameBg4.jpg" ? "bg-neon" : "bg-white"} rounded-lg h-[150px]`}
                />
                <img
                  src="/gameBg5.jpg"
                  onClick={() => setSelectedBg("/gameBg5.jpg")}
                  className={`w-[250px] p-1 ${selectedBg == "/gameBg5.jpg" ? "bg-neon" : "bg-white"} rounded-lg h-[150px]`}
                />
                <img
                  src="/gameBg6.jpg"
                  onClick={() => setSelectedBg("/gameBg6.jpg")}
                  className={`w-[250px] p-1 ${selectedBg == "/gameBg6.jpg" ? "bg-neon" : "bg-white"} rounded-lg h-[150px]`}
                />
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              updateData();
              setSettingsOpen(false);
            }}
            className="bg-neon hover:scale-[1.02] transition duration-300 mb-2 w-[300px] px-10 py-1 text-[20px] font-bold rounded-md"
          >
            Save Changes
          </button>
          <button
            onClick={() => setSettingsOpen(false)}
            className="bg-white/50 hover:scale-[1.02] transition duration-300 w-[300px] px-10 py-1 text-[20px] font-bold rounded-md"
          >
            Cancel
          </button>
        </div>
      ) : null}
      <div
        className={`flex flex-col bg-darkBg h-screen transition-all duration-300 ${
          settingsOpen || gameInvite ? "blur-sm shadow-[0_0_20px] pointer-events-none" : ""
        }`}
      >
        <Navbar />
        <div className="flex flex-row h-screen">
          <Sidebar setSettingsOpen={setSettingsOpen} fetchData={fetchData} />
          <Outlet />
        </div>
      </div>
    </>
  );
}
export default Layout;
