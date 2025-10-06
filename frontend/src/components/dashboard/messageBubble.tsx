import type { UserInfos } from "../../types/user";

interface props {
  unreadCount: number;
  user: UserInfos;
  onclick: () => void;
}

const MessageBubble = ({ unreadCount, user, onclick }: props) => {
  return (
    <div key={user.id} onClick={onclick} className="relative w-[40px] h-[40px] rounded-full">
      <div
        className={`absolute flex px- items-center text-white justify-center h-[15px] min-w-[15px] max-w-[30px] rounded-full text-[10px] top-[-5px] right-[-3px] bg-red-600 border-compBg mt-2`}
      >
        <span className="truncate">{unreadCount > 0 ? unreadCount : null}</span>
      </div>
      <img src={user.avatar} className="rounded-full w-[40px] h-[40px] object-cover shrink-0" />
    </div>
  );
};

export default MessageBubble;
