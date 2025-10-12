import { useNavigate } from "react-router";
import type { LogPacket } from "../../types/websocket";

interface props {
  log: LogPacket;
}

function passedTime(createdAt: string) {
  if (createdAt) {
    const date = new Date(createdAt);
    const msDiff: number = new Date().getTime() - date.getTime();
    const seconds: number = Math.floor(msDiff / 1000);
    const minutes: number = Math.floor(seconds / 60);
    const hours: number = Math.floor(minutes / 60);
    const days: number = Math.floor(hours / 24);
    return days ? days + "d" : hours ? hours + "h" : minutes ? minutes + "m" : seconds + "s";
  }
  return "";
}

const LogCard = ({ log }: props) => {
  const navigate = useNavigate();
  return (
    <li
      key={log.data.id}
      className={`transition-all duration-500 ease-in-out ${
        log.data.is_new ? "animate-slideDown" : log.data.is_removed ? "animate-slideOut" : "animate-justSlide"
      } px-3 py-3 rounded-full bg-compBg flex gap-3 items-center `}
    >
      <img src="/profile1.jpg" className="shrink-0 h-[50px] w-[50px] rounded-full object-cover" />
      <div className="text-white w-full">
        <h2 className="font-bold" onClick={() => navigate("/profile/" + log.data.winner)}>
          {log.data.winner}
        </h2>
        {log.data.game_type == "tournament" ? (
          <p className="text-white/80 font-light">
            Player{" "}
            <a onClick={() => navigate("/profile/" + log.data.winner)} className="font-bold underline">
              {log.data.winner}
            </a>
            {" has "}
            <span className="font-bold">Won</span> The Tournament <span className="font-bold">{log.data.tournament_name}</span>
          </p>
        ) : (
          <p className="text-white/80 font-light">
            Player{" "}
            <a onClick={() => navigate("/profile/" + log.data.winner)} className="font-bold underline">
              {log.data.winner}
            </a>
            {" has "}
            <span className="font-bold">Won</span> a 1v1 match against{" "}
            <a onClick={() => navigate("/profile/" + log.data.loser)} className="font-bold underline">
              {log.data.loser}
            </a>
          </p>
        )}
      </div>
      <div className="mr-5 gap-1 flex flex-col  h-full justify-start items-start">
        <p className="text-white/50  text-[10px]  w-full flex justify-end">{passedTime(log.data.timestamps) + " ago"}</p>
        {/* <BsPersonFillAdd className="text-white h-[25px] w-[25px]" />
         */}
        <div className="w-full border bg-[#05C168]/20 text-[#14CA74] font-medium border-[#14CA74]/50 px-2 py-0.5 rounded-lg">
          <h1 className="font-bold">+{log.data.score}</h1>
        </div>
      </div>
    </li>
  );
};

export default LogCard;
