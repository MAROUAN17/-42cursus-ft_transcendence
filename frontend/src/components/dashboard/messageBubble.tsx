import { useNavigate } from "react-router";
import type { userInfos } from "../../../../backend/src/models/user.model";

interface props {
  unreadCount: number;
  isOnline: boolean;
  user: userInfos;
  onclick: () => void;
}

const MessageBubble = ({ unreadCount, isOnline, user, onclick }: props) => {
  return (
    <div key={user.id} onClick={onclick} className="relative w-[40px] h-[40px] rounded-full">
      <div
        className={`absolute flex px- items-center text-white justify-center h-[15px] min-w-[15px] max-w-[30px] rounded-full text-[10px] top-[-5px] right-[-3px] bg-red-600 border-compBg mt-2`}
      >
        <span className="truncate">{unreadCount > 0 ? unreadCount : null}</span>
      </div>
      <img src={user.avatar} className="rounded-full w-[40px] h-[40px] object-cover" />
    </div>
  );
};

export default MessageBubble;
