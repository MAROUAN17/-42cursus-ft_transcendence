import { useNavigate } from "react-router";
import type { UserInfos } from "../../types/user";

interface props {
  inGame: boolean;
  isOnline: boolean;
  user: UserInfos;
}

const FriendBubble = ({ inGame, isOnline, user }: props) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate(`/profile/${user.username}`);
      }}
      className="relative w-[40px] h-[40px] rounded-full"
    >
      <div
        className={`absolute w-[12px] h-[12px] rounded-full top-[-5px] right-[-3px] ${isOnline ? "bg-[#00FF38]" : "bg-[#A5BAA9]"} border-compBg mt-2`}
      ></div>
      <img title={user.username} src={user.avatar} className="rounded-full w-[40px] h-[40px] object-cover" />
      {inGame ? (
        <div className="absolute top-[45px] w-[60px] h-[22px] bg-neon rounded-[6px] text-white text-[12px] flex justify-center items-center font-medium">
          In Game
        </div>
      ) : null}
    </div>
  );
};

export default FriendBubble;
