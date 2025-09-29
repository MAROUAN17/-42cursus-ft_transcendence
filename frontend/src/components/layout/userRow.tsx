import { useNavigate } from "react-router";
import type { userInfos, userSearch } from "../../../../backend/src/models/user.model";
import { BsPersonFillAdd } from "react-icons/bs";
import { AiFillMessage } from "react-icons/ai";
import { FaUserClock } from "react-icons/fa";
import type { websocketPacket } from "../../../../backend/src/models/webSocket.model";
import { useWebSocket } from "../contexts/websocketContext";
import { TbClockHour2Filled } from "react-icons/tb";

interface props {
  user: userSearch;
  sendReq: (id: number) => void;
  close: () => void;
}

const UserRow = ({ user, sendReq, close }: props) => {
  const navigate = useNavigate();

  return (
    <li>
      <button
        onClick={() => {
          navigate(`/profile/${user.username}`);
        }}
        className="flex  gap-2  w-full flex-row hover:bg-compBg/20 hover:rounded-xl items-center justify-center px-4 py-3 text-white text-left"
      >
        <div className="shrink-0 border-2 border-neon h-[40px] w-[40px] rounded-full overflow-hidden">
          <img src={user.avatar} className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-row w-full justify-between items-center">
          <div className="flex flex-col">
            <h3 className="font-semibold h-[20px] flex items-center text-[18px]">{user.username}</h3>
            <p className="text-[#fff]/[50%] text-[10px]">{user.mutualsCount > 0 ? user.mutualsCount : "no"} mutual friends</p>
          </div>
          {user.status == "friend" ? (
            <AiFillMessage
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/chat/${user.username}`);
                close();
              }}
              className="text-white h-[18px] w-[18px]"
            />
          ) : user.status == "sentReq" ? (
            <TbClockHour2Filled className="text-white h-[18px] w-[18px]" />
          ) : (
            <BsPersonFillAdd
              onClick={(e) => {
                e.stopPropagation();
                sendReq(user.id);
              }}
              className="text-white h-[18px] w-[18px]"
            />
          )}
        </div>
      </button>
    </li>
  );
};

export default UserRow;
