import { TiDelete } from "react-icons/ti";
import type { notificationPacket, websocketPacket } from "../../../../backend/src/models/webSocket.model";
import { useNavigate } from "react-router";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import api from "../../axios";
import { useWebSocket } from "../contexts/websocketContext";

interface props {
  notification: notificationPacket;
  deleteFunc: (notif: notificationPacket) => void;
  markNotifSeen: (notification: notificationPacket) => void;
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
const NotificationElement = ({ notification, deleteFunc, markNotifSeen }: props) => {
  const { send } = useWebSocket();
  const navigate = useNavigate();
  const [removeNotif, setRemoveNotif] = useState<boolean>(false);

  function sendAcceptFriend(notif: notificationPacket) {
    const packet: websocketPacket = {
      type: "notification",
      data: {
        id: 0,
        type: "friendAccept",
        username: "",
        avatar: "",
        sender_id: notification.recipient_id,
        recipient_id: notification.sender_id,
        message: `You and ${notification.username} are now friends!`,
        createdAt: "",
      },
    };
    send(JSON.stringify(packet));
  }
  return (
    <li className={`${removeNotif ? "duration-500 opacity-0 translate-x-5" : ""}`}>
      <button
        onClick={() => {
          if (notification.type == "message") {
            markNotifSeen(notification);
            navigate(`/chat/${notification.username}`);
          }
        }}
        className="flex group gap-3 w-full flex-row hover:bg-compBg/20 hover:rounded-xl  px-4 py-3 text-white text-left"
      >
        <img src={notification.avatar} className="border shrink-0 border-white h-[40px] w-[40px] object-cover rounded-full p-[1px]" />
        <div className="flex flex-col w-full">
          <div className="flex flex-row justify-between items-center">
            <h3 className="font-medium text-[14px]">{notification.username}</h3>
            <p className="text-[#fff]/[40%] text-[11px]">{passedTime(notification.createdAt) + " ago"}</p>
          </div>
          <div className="flex flex-row justify-between items-center">
            <p className="text-[#fff]/[50%] truncate text-ellipsis w-40 text-[11px]">{notification.message}</p>
            {notification.type == "message" && notification.unreadCount ? (
              <div className="bg-red-600 w-fit px-1 h-[16px] flex justify-center items-center rounded-full text-[#fff]/[60%] text-[11px]">
                <p className="text-[#fff]/[50%] truncate text-ellipsis max-w-8 text-[11px]">{notification.unreadCount}</p>
              </div>
            ) : null}
          </div>
        </div>
        {notification.type == "friendReq" ? (
          <div className="flex flex-col justify-between items-center">
            <FaCheck
              color="green"
              onClick={() => {
                api
                  .post("/add-friend/" + notification.sender_id, {}, { withCredentials: true })
                  .then(function (res) {
                    console.log(res);
                  })
                  .catch(function (err) {
                    console.log(err);
                  });
                setRemoveNotif(true);
                deleteFunc(notification);
                sendAcceptFriend(notification);
              }}
            />
            <IoClose
              color="red"
              size={20}
              onClick={() => {
                setRemoveNotif(true);
                deleteFunc(notification);
              }}
            />
          </div>
        ) : (
          <TiDelete
            onClick={(e) => {
              e.stopPropagation();
              setRemoveNotif(true);
              deleteFunc(notification);
            }}
            className={`opacity-0 w-[20px] h-[20px] group-hover:opacity-100 transition-opacity duration-200`}
          />
        )}
      </button>
    </li>
  );
};

export default NotificationElement;
