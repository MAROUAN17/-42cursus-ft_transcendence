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
    <div key={user.id} onClick={onclick} className="relative w-[55px] h-[55px] bg-[#FFDCB9] rounded-full">
      <div
        className={`absolute flex px- items-center justify-center h-[12px] min-w-[12px] max-w-[30px] rounded-full text-[10px] top-0 right-0 ${
          isOnline ? "bg-[#00FF38]" : "bg-[#A5BAA9]"
        } border-compBg mt-2`}
      >
        <span className="truncate">{unreadCount > 0 ? unreadCount : null}</span>
      </div>
      <img src={user.avatar} className="rounded-full" />
    </div>
  );
};

export default MessageBubble;
