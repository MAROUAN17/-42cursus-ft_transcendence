import { useEffect, useState } from "react";
import type { Leader } from "../../types/leader";
import api from "../../axios";
import { BsPersonFillAdd } from "react-icons/bs";
import LogCard from "../dashboard/logCard";

export const Leaderboard = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);

  useEffect(() => {
    api("/states/leaders", { withCredentials: true }).then((res) => {
      setLeaders(res.data.leaderboard);
    });
  }, []);

  return (
    <div className=" font-poppins w-full px-24 pb-[70px] flex flex-col gap-10">
      <div className="text-white font-bold text-6xl text-center">LEADERBOARD</div>
      {/* Top 3 horizontally */}
      <div className="flex justify-center gap-6 h-1/2">
        {leaders.slice(0, 3).map((leader: Leader) => (
          <div
            key={leader.rank}
            className="flex basis-1/3 h-full flex-col-reverse items-center gap-4 p-2"
          >
            <div
              className={`bg-compBg transition-all duration-700 ease-in-out flex flex-col p-5 justify-between items-center text-white ${
                leader.rank == 3
                  ? "h-2/5"
                  : leader.rank == 2
                  ? "h-3/5"
                  : leader.rank == 1
                  ? "h-4/5"
                  : ""
              } ${
                show ? "overflow-hidden" : "h-5 overflow-hidden"
              } w-full rounded-[30px]`}
            >
              <div className="relative flex flex-col items-center w-[24px] h-[24px] gap-6">
                <div
                  className={`absolute inset-0 rounded-[5px] ${
                    leader.rank == 3
                      ? "bg-[#00D95F]"
                      : leader.rank == 2
                      ? "bg-[#009BD6]"
                      : leader.rank == 1
                      ? "bg-[#FFAA00]"
                      : ""
                  } rotate-[45deg]`}
                />
                <div className="relative flex items-center justify-center w-full h-full text-white font-bold">
                  {leader.rank}
                </div>
                <div className="flex flex-col items-center">
                  <h3 className="font-bold text-2xl">{leader.username}</h3>
                </div>
              </div>
              <h2
                className={`font-bold text-shadow-[50px] text-shadow-black text-4xl
                ${
                  leader.rank == 3
                    ? "text-[#00D95F]"
                    : leader.rank == 2
                    ? "text-[#009BD6]"
                    : leader.rank == 1
                    ? "text-[#FFAA00]"
                    : ""
                }`}
              >
                {leader.score}
              </h2>
            </div>
            <img
              src={leader.avatar}
              className="h-[120px] w-[120px] rounded-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Others below */}
      <div className="px-2 flex flex-col gap-4 h-[600px] overflow-y-auto scrollbar-thin scrollbar scrollbar-thumb-neon/80 scrollbar-track-white/10">
        {leaders.slice(3).map((leader: Leader) => (
          <div
            key={leader.rank}
            className="px-5 py-4 rounded-full bg-compBg flex gap-3 items-center"
          >
            <h1 className="text-white font-bold text-2xl">{leader.rank}</h1>
            <img
              src={leader.avatar}
              className="shrink-0 h-[60px] w-[60px] rounded-full object-cover"
            />
            <div className="text-white w-full flex justify-between px-4 items-center">
              <h2 className="font-bold text-2xl">{leader.username}</h2>
              <p className="font-bold text-3xl items-center">{leader.score}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
