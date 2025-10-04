import React, { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import type { userSearch } from "../../../../backend/src/models/user.model";
import { RiArrowDropDownLine } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import type { notificationPacket, websocketPacket } from "../../../../backend/src/models/webSocket.model";
import { useWebSocket } from "../contexts/websocketContext";
import NotificationElement from "./notificationElement";
import { useNavigate } from "react-router";
import api from "../../axios";
import { FiLogOut } from "react-icons/fi";
import { useUserContext } from "../contexts/userContext";
import UserRow from "./userRow";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [foundUsers, setFoundUsers] = useState<userSearch[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [isSearchFilled, setIsSearchFilled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isUserOptionOpen, setIsUserOptionOpen] = useState<boolean>(false);
  const [hasUnread, setHasUnread] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<notificationPacket[]>([]);
  const notificationRef = useRef<HTMLDivElement>(null);

  const { send, addHandler } = useWebSocket();

  function handleLogout(e: React.MouseEvent<HTMLLIElement>) {
    e.preventDefault();
    api
      .post("/logout", {}, { withCredentials: true })
      .then(function (res) {
        console.log(res);
        navigate("/login");
      })
      .catch(function (err) {
        console.log(err.response);
      });
  }

  useEffect(() => {
    api
      .get("/notifications", { withCredentials: true })
      .then((res) => {
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
          return notif.sender_id == packet.data.recipient_id ? { ...notif, unreadCount: 0 } : notif;
        });
      });
    } else if (newNotif.type == "friendReq" || newNotif.type == "friendAccept") {
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
        avatar: "",
        sender_id: notification.recipient_id,
        recipient_id: notification.sender_id,
        message: "",
        createdAt: "",
      },
    };
    send(JSON.stringify(packet));
    setNotifications((prev) => prev.map((notif) => (notif.id == notification.id ? { ...notif, unreadCount: 0 } : notif)));
  }

  function startSearch(event: React.KeyboardEvent) {
    if (!user) return;
    if (event.key == "Enter" && searchInput.length) {
      setIsSearchOpen(true);
      setLoading(true);
      api
        .get("/search?query=" + searchInput, { withCredentials: true })
        .then(function (res) {
          console.log(res.data.data);
          setFoundUsers(res.data.data);
        })
        .finally(() => setLoading(false));
    }
  }

  function sendFriendReq(userId: number) {
    if (!user) return;
    const notif: websocketPacket = {
      type: "notification",
      data: {
        id: 0,
        type: "friendReq",
        avatar: "",
        username: "",
        sender_id: user.id,
        recipient_id: userId,
        message: "Sent you a friend request",
        createdAt: new Date().toISOString().replace("T", " ").split(".")[0],
      },
    };
    send(JSON.stringify(notif));
    setFoundUsers((prev: userSearch[]) => {
      return prev.map((user) => {
        return user.id == userId ? { ...user, status: "sentReq" } : user;
      });
    });
  }

  function closeSearch() {
    setSearchInput("");
    setIsSearchOpen(false);
    setFoundUsers([]);
  }

  return (
    <nav className="w-full bg-darkBg font-poppins">
      <div className="flex flex-row justify-end items-center w-screen h-fit p-3">
        <div className="relative w-fit ">
          <div className="flex p-4 flex-row bg-neon/[35%] items-center h-[45px] w-[350px] rounded-full">
            <FaSearch className="text-white w-[15px] h-[15px]" />
            <input
              autoComplete="off"
              type="text"
              id="query"
              value={searchInput}
              onKeyDown={startSearch}
              onChange={(e) => {
                setSearchInput(e.target.value);
                if (e.target.value == "") {
                  setFoundUsers([]);
                  setIsSearchOpen(false);
                }
              }}
              placeholder="Search for users..."
              className="w-full pl-3 h-[45px] placeholder-[#fff]/[40%] focus:outline-none rounded-md bg-transparent text-white"
            />
            {searchInput.length ? (
              <TiDelete
                onClick={() => {
                  setSearchInput("");
                  setIsSearchOpen(false);
                  setFoundUsers([]);
                }}
                className="text-white w-[25px] h-[25px]"
              />
            ) : null}
          </div>
          {isSearchOpen ? (
            <div className="absolute overflow-hidden top-[55px] w-[350px] z-10  bg-[#1f085f] rounded-lg shadow-[0_0px_20px_rgba(0,0,0,0.25)]">
              <ul className="max-h-[330px] overflow-y-auto scrollbar-thin scrollbar scrollbar-thumb-neon/80 scrollbar-track-white/10">
                {foundUsers.length ? (
                  foundUsers.map((user) => <UserRow close={closeSearch} sendReq={sendFriendReq} user={user} />)
                ) : loading ? (
                  <li>
                    <button className="flex animate-pulse gap-2  w-full flex-row hover:bg-compBg/20 hover:rounded-xl items-center justify-center px-4 py-3 text-white text-left">
                      <div className="shrink-0 h-[40px] w-[40px] bg-white/[10%] rounded-full overflow-hidden"></div>
                      <div className="flex flex-row w-full justify-between items-center">
                        <div className="flex flex-col gap-1">
                          <div className="h-[10px] w-[70px] rounded-full bg-white/10"></div>
                          <div className="h-[10px] w-[120px] rounded-full bg-white/10"></div>
                        </div>
                      </div>
                    </button>
                  </li>
                ) : (
                  <h2 className="text-center font-medium py-2 text-white">No Users Found</h2>
                )}
              </ul>
            </div>
          ) : null}
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
              <img src={user?.avatar} className="h-[30px] w-[30px] object-cover rounded-full" />
              <h3 className="text-white font-medium text-[12px]">{user?.username}</h3>
              <RiArrowDropDownLine className="text-white w-[20px] h-[20px]" />
            </div>
            {isUserOptionOpen ? (
              <div className="absolute overflow-hidden right-0 mt-2 w-fit z-10 bg-[#1f085f] border-2 border-neon/10 rounded-lg shadow-[0_0px_1px_rgba(0,0,0,0.25)] shadow-neon">
                <ul>
                  <li className="text-red-500 flex items-center hover:bg-compBg/30 gap-2 justify-center py-2 px-4" onClick={handleLogout}>
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
