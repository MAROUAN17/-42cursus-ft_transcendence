import { TiDelete } from "react-icons/ti";
import type { notificationPacket } from "../../../../backend/src/models/webSocket.model";
import { useNavigate } from "react-router";
import { useState } from "react";

interface props {
  notification: notificationPacket;
  deleteFunc: (notif: notificationPacket) => void;
}

function passedTime(createdAt: string) {
  const date = new Date(createdAt + "Z");
  const msDiff: number = new Date().getTime() - date.getTime();
  const seconds: number = Math.floor(msDiff / 1000);
  const minutes: number = Math.floor(seconds / 60);
  const hours: number = Math.floor(minutes / 60);
  const days: number = Math.floor(hours / 24);
  return days ? days + " days" : hours ? hours + " hours" : minutes ? minutes + " minutes" : seconds + " seconds";
}
const NotificationElement = ({ notification, deleteFunc }: props) => {
  const navigate = useNavigate();
  const [removeNotif, setRemoveNotif] = useState<boolean>(false);
  return (
    <li className={`${removeNotif ? "duration-500 opacity-0 translate-x-5" : ""}`}>
      <button
        onClick={() => {
          notification.unreadCount = 0;
          navigate(`/chat/${notification.username}`);
        }}
        className="flex group gap-3 w-full flex-row hover:bg-compBg/20 hover:rounded-xl  px-4 py-2 text-white text-left"
      >
        <img src="/src/assets/photo.png" className="border border-white h-[40px] w-[40px] rounded-full p-[1px]" />
        <div className="flex flex-col w-full">
          <div className="flex flex-row justify-between items-center">
            <h3 className="font-medium text-[14px]">{notification.username}</h3>
            <p className="text-[#fff]/[40%] text-[11px]">{passedTime(notification.createdAt) + " ago"}</p>
          </div>
          <div className="flex flex-row justify-between items-center">
            <p className="text-[#fff]/[50%] truncate text-ellipsis w-40 text-[11px]">{notification.message}</p>
            {notification.unreadCount ? (
              <div className="bg-red-600 w-fit px-1 h-[16px] flex justify-center items-center rounded-full text-[#fff]/[60%] text-[11px]">
                <p className="text-[#fff]/[50%] truncate text-ellipsis max-w-8 text-[11px]">
                  {notification.unreadCount}
                </p>
              </div>
            ) : null}
          </div>
        </div>
        <TiDelete
          onClick={(e) => {
            e.stopPropagation();
            setRemoveNotif(true);
            deleteFunc(notification);
          }}
          className="opacity-0 w-[20px] h-[20px] group-hover:opacity-100 transition-opacity duration-200"
        />
      </button>
    </li>
  );
};

export default NotificationElement;
