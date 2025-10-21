import { FaArrowLeft, FaCog, FaSpinner } from "react-icons/fa";
import av1 from "../imgs/av1.png";
import av2 from "../imgs/av2.png";
import { useNavigate } from "react-router";
import type { Player } from "./Types";
import { useEffect } from "react";

interface HeaderProps {
  scoreLeft: number;
  scoreRight: number;
  you: Player | undefined | number;
  opponent: Player | undefined | number;
  side: string | undefined;
  gameState: string;
}

export default function RHeader({ scoreLeft, scoreRight, you, opponent, side, gameState }: HeaderProps) {
  useEffect(() => {
    console.log("game -> ", gameState);
  });
  const navigate = useNavigate();
  function leave_game() {
    navigate("/pairing");
  }
  //console.log(you?.username)
  return (
    <div className="font-poppins absolute top-5 left-0 w-full flex items-center justify-between px-6 py-4 z-50">
      <div className="flex items-center space-x-4">
        <button onClick={() => leave_game()} className="bg-black bg-opacity-60 p-3 rounded-full hover:bg-opacity-80 transition">
          <FaArrowLeft className="text-white text-xl" />
        </button>
        <button className="bg-black bg-opacity-60 p-3 rounded-full hover:bg-opacity-80 transition">
          <FaCog className="text-white text-xl" />
        </button>
      </div>

      <div className="absolute left-1/2 top-8 transform -translate-x-1/2 flex items-center gap-16 text-white font-bold">
        <div className="flex flex items-center gap-4">
          <img
            src={side === "left" ? you?.avatar : opponent?.avatar}
            className="w-20 h-20 rounded-full border-4 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]"
          />
          {/* <span>{side === "left" ? you?.username : opponent?.username}</span> */}
          <span className="text-3xl mt-2">{scoreLeft}</span>
        </div>

        <div className="flex">
          <span className="border-neon text-5xl text-white [-webkit-text-stroke:2px_theme(colors.neon)]">V</span>
          <span className="text-5xl text-white py-3 [-webkit-text-stroke:2px_theme(colors.neon)]">S</span>
        </div>

        <div className="flex flex items-center gap-4">
          <span className="text-3xl mt-2">{scoreRight}</span>
          {!gameState ? (
            <div className="relative w-[90px] h-[90px]">
              <img
                src={side === "right" ? you?.avatar : opponent?.avatar}
                className={`w-20 h-20 rounded-full ${
                  gameState ? "border-4 border-yellow-400" : "border-4 border-gray-400 opacity-70"
                } shadow-[0_0_15px_rgba(250,204,21,0.8)]`}
              />
              <FaSpinner className="absolute animate-[spin_1.3s_linear_infinite] w-[30px] h-[30px] top-6 left-6" />
            </div>
          ) : (
            <img
              src={side === "right" ? you?.avatar : opponent?.avatar}
              className={`w-20 h-20 rounded-full ${
                gameState ? "border-4 border-yellow-400" : "border-4 border-gray-400 opacity-30"
              } shadow-[0_0_15px_rgba(250,204,21,0.8)]`}
            />
          )}

          {/* <span>{side === "right" ? you?.username : opponent?.username}</span> */}
        </div>
      </div>

      <div className="w-[64px]" />
    </div>
  );
}
