import { FaUser } from "react-icons/fa";
import type { userInfos } from "../../../../backend/src/models/user.model";
import { GiPingPongBat } from "react-icons/gi";
import { useState } from "react";
import { useNavigate } from "react-router";

interface props {
  inGame: boolean;
  isOnline: boolean;
  user: userInfos;
  friendOpt: Number;
  setFriendOpt: () => void;
}

const FriendBubble = ({ inGame, isOnline, user, friendOpt, setFriendOpt }: props) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        setFriendOpt();
      }}
      className="relative w-[55px] h-[55px] bg-[#FFDCB9] rounded-full"
    >
      <div className={`absolute w-[12px] h-[12px] rounded-full top-0 right-0 ${isOnline ? "bg-[#00FF38]" : "bg-[#A5BAA9]"} border-compBg mt-2`}></div>
      <img src={user.avatar} className="rounded-full" />
      {friendOpt == user.id ? (
        <div className="absolute overflow-hidden right-20 top-[-20px] mt-2 w-[180px] z-10  bg-[#390a85] bg-compBg rounded-lg shadow-[0_0px_20px_rgba(0,0,0,0.25)]">
          <ul>
            <li
              onClick={() => navigate("/profile/" + user.username)}
              className="text-white border border-transparent border-b-white/10 flex items-center hover:bg-compBg/30 gap-2 justify-center py-2 px-4"
            >
              <FaUser />
              <p>Profile</p>
            </li>
            <li className="text-white flex items-center hover:bg-compBg/30 gap-2 justify-center py-2 px-4">
              <GiPingPongBat />
              <p>Invite to a Match</p>
            </li>
          </ul>
        </div>
      ) : null}

      <div className="absolute top-[45px] w-full h-[20px] bg-neon rounded-[6px] text-white text-[14px] flex justify-center items-center font-semibold">
        <span className="truncate w-fit h-fit pb-1">{user.username}</span>
      </div>
      {inGame ? (
        <div className="absolute top-[45px] w-[60px] h-[22px] bg-neon rounded-[6px] text-white text-[12px] flex justify-center items-center font-medium">
          In Game
        </div>
      ) : null}
    </div>
  );
};

export default FriendBubble;
