import type { userInfos } from "../../../../backend/src/models/user.model";

interface props {
  inGame: boolean;
  isOnline: boolean;
  user: userInfos;
}

const FriendBubble = ({ inGame, isOnline, user }: props) => {
  return (
    <div className="relative w-[55px] h-[55px] bg-[#FFDCB9] rounded-full">
      <div className={`absolute w-[12px] h-[12px] rounded-full top-0 right-0 ${isOnline ? "bg-[#00FF38]" : "bg-[#A5BAA9]"} border-compBg mt-2`}></div>
      <img src={user.avatar} className="rounded-full" />
      {inGame ? (
        <div className="absolute top-[45px] w-[60px] h-[22px] bg-neon rounded-[6px] text-white text-[12px] flex justify-center items-center font-medium">
          In Game
        </div>
      ) : null}
    </div>
  );
};

export default FriendBubble;
