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
      className="relative w-[40px] h-[40px] rounded-full"
    >
      <div
        className={`absolute w-[12px] h-[12px] rounded-full top-[-5px] right-[-3px] ${isOnline ? "bg-[#00FF38]" : "bg-[#A5BAA9]"} border-compBg mt-2`}
      ></div>
      <img title={user.username} src={user.avatar} className="rounded-full w-[40px] h-[40px] object-cover" />
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

      {inGame ? (
        <div className="absolute top-[45px] w-[60px] h-[22px] bg-neon rounded-[6px] text-white text-[12px] flex justify-center items-center font-medium">
          In Game
        </div>
      ) : null}
    </div>
  );
};

export default FriendBubble;
