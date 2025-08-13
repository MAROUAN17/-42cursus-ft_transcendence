import { FaArrowLeft, FaCog } from "react-icons/fa";
import av1 from "../imgs/av1.png";
import av2 from "../imgs/av2.png";

interface HeaderProps {
  scoreLeft: number;
  scoreRight: number;
}

export default function RHeader({ scoreLeft, scoreRight }: HeaderProps) {
  return (
    <div className="absolute top-5 left-0 w-full flex items-center justify-between px-6 py-4 z-50">
      {/* Left controls */}
      <div className="flex items-center space-x-4">
        <button className="bg-black bg-opacity-60 p-3 rounded-full hover:bg-opacity-80 transition">
          <FaArrowLeft className="text-white text-xl" />
        </button>
        <button className="bg-black bg-opacity-60 p-3 rounded-full hover:bg-opacity-80 transition">
          <FaCog className="text-white text-xl" />
        </button>
      </div>

      {/* Center scores */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-16 text-white font-bold">
        {/* Left Player */}
        <div className="flex flex-col items-center">
          <img
            src={av1}
            className="w-20 h-20 rounded-full border-4 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]"
          />
          <span className="text-3xl mt-2">{scoreLeft}</span>
        </div>

        {/* VS text */}
        <span className="text-5xl text-purple-400">VS</span>

        {/* Right Player */}
        <div className="flex flex-col items-center">
          <img
            src={av2}
            className="w-20 h-20 rounded-full border-4 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.8)]"
          />
          <span className="text-3xl mt-2">{scoreRight}</span>
        </div>
      </div>

      {/* Right spacer to balance layout */}
      <div className="w-[64px]" />
    </div>
  );
}

