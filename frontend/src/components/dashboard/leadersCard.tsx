import { useEffect, useState } from "react";
import axios from "axios";
import { useWebSocket } from "../contexts/websocketContext";

interface props {
  rank: number;
  username: string;
  name: string;
  score: number;
}

const LeadersCard = ({ rank, username, name, score }: props) => {
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 100);
  }, []);

  return (
    <div className="flex basis-1/3 h-full flex-col-reverse items-center gap-4 p-2">
      <div
        className={`bg-compBg transition-all duration-700 ease-in-out flex flex-col p-5 justify-between items-center text-white ${
          rank == 3 ? "h-3/5" : rank == 2 ? "h-4/5" : rank == 1 ? "h-full" : ""
        } ${
          show ? "overflow-hidden" : "h-5 overflow-hidden"
        } w-full rounded-[30px]`}
      >
        <div className="relative flex flex-col items-center w-[24px] h-[24px] gap-6">
          <div
            className={`absolute inset-0 rounded-[5px] ${
              rank == 3
                ? "bg-[#00D95F]"
                : rank == 2
                ? "bg-[#009BD6]"
                : rank == 1
                ? "bg-[#FFAA00]"
                : ""
            } rotate-[45deg]`}
          ></div>
          <div className="relative flex items-center justify-center w-full h-full text-white font-bold">
            {rank}
          </div>
          <div className="flex flex-col items-center">
            <h3 className="font-bold">{name}</h3>
            <p>@{username}</p>
          </div>
        </div>
        <h2 className="font-bold text-shadow-[50px] text-shadow-black text-3xl">
          {score}
        </h2>
      </div>
      <img src={`${
              rank == 3
                ? "/profile1.jpg"
                : rank == 2
                ? "/profile2.jpg"
                : rank == 1
                ? "/profile3.jpg"
                : ""
            }`} className="h-[60px] w-[60px] rounded-full object" />
    </div>
  );
};

export default LeadersCard;
