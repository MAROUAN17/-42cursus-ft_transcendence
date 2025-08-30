import { IoCheckmark, IoCheckmarkDoneOutline } from "react-icons/io5";

interface props {
  msg: string;
  name: string;
  onclick: () => void;
  style: string;
  isRead?: boolean;
  type: "sender" | "recipient";
  isDelivered?: boolean;
  createdAt?: string;
  unreadCount: number;
}

function passedTime(createdAt: string) {
  if (createdAt) {
    const date = new Date(createdAt + "Z");
    const msDiff: number = new Date().getTime() - date.getTime();
    const seconds: number = Math.floor(msDiff / 1000);
    const minutes: number = Math.floor(seconds / 60);
    const hours: number = Math.floor(minutes / 60);
    const days: number = Math.floor(hours / 24);
    return days
      ? days + "d"
      : hours
      ? hours + "h"
      : minutes
      ? minutes + "m"
      : seconds + "s";
  }
  return "";
}

const UserBubble = ({
  msg,
  name,
  onclick,
  style,
  isDelivered,
  isRead,
  type,
  createdAt,
  unreadCount,
}: props) => {
  return (
    <div onClick={onclick} className={style}>
      <img src="/src/assets/photo.png" className="h-[44px] w-[44px]" />
      <div className="w-full">
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-white font-medium">{name}</h3>
          <p className="text-[#fff]/[40%] text-[13px]">
            {createdAt ? passedTime(createdAt) + " ago" : ""}
          </p>
        </div>
        <div className="flex flex-row justify-between items-center">
          <p className="text-[#fff]/[40%] text-[13px] truncate text-ellipsis w-40">
            {msg}
          </p>
          {type == "sender" ? (
            isDelivered ? (
              <IoCheckmarkDoneOutline
                className={`${
                  isRead ? "text-[#3469F9]" : "text-[#fff]/[40%]"
                } self-end w-[16px] h-[16px]`}
              />
            ) : (
              <IoCheckmark className="text-[#fff]/[40%] self-end w-[16px] h-[16px]" />
            )
          ) : unreadCount ? (
            <div className="bg-red-600 w-fit px-2 h-[16px] flex justify-center items-center rounded-full text-[#fff]/[60%] text-[11px]">
              {unreadCount}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default UserBubble;
