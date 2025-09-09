import React, { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import axios from "axios";
import type { User, userInfos } from "../../../../backend/src/models/user.model";
import { IoIosArrowDropdown } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import type { notificationPacket, websocketPacket } from "../../../../backend/src/models/webSocket.model";
import { useWebSocket } from "../chat/websocketContext";
import NotificationElement from "./notificationElement";
import { useNavigate } from "react-router";
import api from "../../axios";
import { FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useWebSocket();
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [isUserOptionOpen, setIsUserOptionOpen] = useState<boolean>(false);
  const [hasUnread, setHasUnread] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<notificationPacket[]>([]);
  const notificationRef = useRef<HTMLDivElement>(null);

  const { send, addHandler } = useWebSocket();

  useEffect(() => {
    api
      .get("/notifications", { withCredentials: true })
      .then((res) => {
        console.log("notifications -> ", res.data.data);
        setNotifications(res.data.data);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
    const addedHandled = addHandler("notification", handleNotification);
    return addedHandled;
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) setIsNotificationOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    const res: notificationPacket | undefined = notifications?.find((notif: notificationPacket) => {
      return notif.unreadCount ? notif.unreadCount > 0 : false;
    });
    // console.log("res -> ", res);
    res ? setHasUnread(true) : setHasUnread(false);
  }, [notifications]);

  function handleNotification(packet: websocketPacket) {
    if (packet.type != "notification") return;
    const newNotif: notificationPacket = packet.data;
    if (newNotif.type == "message") {
      setNotifications((prev) => {
        const index = prev.findIndex((notif) => notif.id == newNotif.id);
        if (index == -1) return [...prev, newNotif];
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          message: newNotif.message,
          unreadCount: (updated[index].unreadCount ?? 0) + 1,
        };
        return updated;
      });
    } else if (newNotif.type == "markSeen") {
      setNotifications((prev) => {
        return prev.map((notif) => {
          return notif.sender_id == packet.data.sender_id ? { ...notif, unreadCount: 0 } : notif;
        });
      });
    } else if (newNotif.type == "friendReq") {
      setNotifications((prev) => [...prev, newNotif]);
    }
  }

  function deleteNotification(notif: notificationPacket) {
    api.delete("/notifications/" + notif.id, {
      withCredentials: true,
    });
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id != notif.id));
    }, 500);
  }

  function markNotifSeen(notification: notificationPacket) {
    const packet: websocketPacket = {
      type: "notification",
      data: {
        id: 0,
        type: "markSeen",
        username: "",
        sender_id: notification.sender_id,
        recipient_id: notification.recipient_id,
        message: "",
        createdAt: "",
      },
    };
    send(JSON.stringify(packet));
    setNotifications((prev) => prev.map((notif) => (notif.id == notification.id ? { ...notif, unreadCount: 0 } : notif)));
  }

  return (
    <nav className="w-full bg-darkBg font-poppins">
      <div className="flex flex-row justify-between items-center w-screen h-fit p-3 bg-compBg/20">
        <h1 className="text-white font-semibold text-[25px]">Dashboard</h1>
        <div className="flex p-4 flex-row bg-neon/[35%] items-center h-[45px] w-[350px] rounded-xl mx-3">
          <FaSearch className="text-white w-[15px] h-[15px]" />
          <input
            type="text"
            placeholder="Search for users..."
            className="w-full pl-3 h-[45px] placeholder-[#fff]/[40%] focus:outline-none rounded-md bg-transparent text-white"
          />
        </div>
        <div className="flex flex-row gap-3">
          <div ref={notificationRef} className="relative inline-block">
            <button onClick={() => setIsNotificationOpen(!isNotificationOpen)} className="p-4 flex bg-neon/[10%] hover:bg-neon/[20%] rounded-xl">
              <IoNotifications className="text-neon w-[20px] h-[20px]" />
              {hasUnread ? <div className="w-[5px] h-[5px] rounded-full bg-red-600 ml-[-4px] mt-[-2px]"></div> : null}
            </button>
            {isNotificationOpen ? (
              <div className="absolute overflow-hidden right-0 mt-2 w-72 z-10  bg-[#1f085f] rounded-lg shadow-[0_0px_20px_rgba(0,0,0,0.25)]">
                <ul className="">
                  {notifications?.length ? (
                    notifications.map((notification) => (
                      <NotificationElement
                        deleteFunc={deleteNotification}
                        key={notification.id}
                        notification={notification}
                        markNotifSeen={markNotifSeen}
                      />
                    ))
                  ) : (
                    <h2 className="text-center font-medium py-2 text-white">No notifications yet 🎉</h2>
                  )}
                </ul>
              </div>
            ) : null}
          </div>
          <div className="relative">
            <div onClick={() => setIsUserOptionOpen(!isUserOptionOpen)} className="p-3 gap-1 flex items-center hover:bg-neon/[20%] rounded-xl">
              <img src="/src/assets/photo.png" className="h-[30px] w-[30px]" />
              <h3 className="text-white font-medium text-[12px]">{user?.username}</h3>
              <RiArrowDropDownLine className="text-white w-[20px] h-[20px]" />
            </div>
            {isUserOptionOpen ? (
              <div className="absolute overflow-hidden right-0 mt-2 w-fit z-10 bg-[#1f085f] border-2 border-neon/10 rounded-lg shadow-[0_0px_1px_rgba(0,0,0,0.25)] shadow-neon">
                <ul>
                  <li className="text-red-500 flex items-center hover:bg-compBg/30 gap-2 justify-center py-2 px-4">
                    <FiLogOut />
                    <p>Logout</p>
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
