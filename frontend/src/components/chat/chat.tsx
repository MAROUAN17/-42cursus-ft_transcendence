import { IoFilter } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { IoIosMore } from "react-icons/io";
import { RiSendPlaneFill } from "react-icons/ri";
import UserBubble from "./UserBubble";
import { IoCheckmark } from "react-icons/io5";
import type { User } from "../../../../backend/src/models/user.model";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import type { UsersLastMessage, messagePacket } from "../../../../backend/src/models/chat";
import ChatBubble from "./ChatBubble";
import { v4 as uuidv4 } from "uuid";
import { useWebSocket } from "./websocketContext";
import type { notificationPacket, websocketPacket } from "../../../../backend/src/models/webSocket.model";
import { useParams, useNavigate } from "react-router";

const Chat = () => {
  const { username } = useParams<{ username?: string }>();
  const [messages, setMessages] = useState<messagePacket[]>([]);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [users, setUsers] = useState<UsersLastMessage[]>([]);
  const [targetUser, setTargetUser] = useState<User | null>();
  const [currUser, setCurrUser] = useState<User>();
  const [searchInput, setSearchInput] = useState<string>("");
  const currUserRef = useRef(currUser);
  const targetUserRef = useRef(targetUser);

  const { send, addHandler } = useWebSocket();
  useEffect(() => {
    if (!targetUser) return;
    axios("https://localhost:5000/messages/" + targetUser.id, {
      withCredentials: true,
    })
      .then((res) => {
        setMessages(res.data.data);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalReq = error.config;

        if (error.response.status == 401 && error.response.data.error == "JWT_EXPIRED") {
          originalReq._retry = false;
          try {
            const res = await axios.post("https://localhost:5000/jwt/new", {}, { withCredentials: true });
            console.log(res);
            return axios(originalReq);
          } catch (error) {
            console.log(error);
            const navigate = useNavigate();
            navigate("/login");
          }
        }
        return Promise.reject(error);
      }
    );
  }, [targetUser]);

  useEffect(() => {
    axios("https://localhost:5000/user", { withCredentials: true })
      .then((res) => {
        setCurrUser(res.data.infos);
        currUserRef.current = res.data.infos;
      })
      .catch((error) => console.error("Error fetching user:", error));
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalReq = error.config;

        if (error.response.status == 401 && error.response.data.error == "JWT_EXPIRED") {
          originalReq._retry = false;
          try {
            const res = await axios.post("https://localhost:5000/jwt/new", {}, { withCredentials: true });
            console.log(res);
            return axios(originalReq);
          } catch (error) {
            console.log(error);
            const navigate = useNavigate();
            navigate("/login");
          }
        }
        return Promise.reject(error);
      }
    );
    const addedHandled = addHandler("chat", handleChat);
    return addedHandled;
  }, []);

  useEffect(() => {
    axios("https://localhost:5000/users", { withCredentials: true })
      .then((res) => {
        res.data.data.sort(function (a: UsersLastMessage, b: UsersLastMessage) {
          const x: string = a.lastMessage ? a.lastMessage.createdAt : "";
          const y: string = b.lastMessage ? b.lastMessage.createdAt : "";
          if (x > y) return -1;
          return 1;
        });
        if (username) {
          const foundUser: UsersLastMessage = res.data.data.find((user: UsersLastMessage) => {
            return user.user.username == username;
          });
          if (foundUser) {
            res.data.data.map((user: UsersLastMessage) =>
              user.user.id == foundUser.user.id ? (user.unreadCount = 0) : null
            );
            setTargetUser(foundUser.user);
            targetUserRef.current = foundUser.user;
          }
        }
        setUsers(res.data.data);
      })
      .catch((error) => console.error("Error fetching users:", error));
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalReq = error.config;

        if (error.response.status == 401 && error.response.data.error == "JWT_EXPIRED") {
          originalReq._retry = false;
          try {
            const res = await axios.post("https://localhost:5000/jwt/new", {}, { withCredentials: true });
            console.log(res);
            return axios(originalReq);
          } catch (error) {
            console.log(error);
            const navigate = useNavigate();
            navigate("/login");
          }
        }
        return Promise.reject(error);
      }
    );
  }, [username]);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const messageObj: string | null = entry.target.getAttribute("data-message");
          if (!messageObj) return;
          const msgPacket: messagePacket = JSON.parse(messageObj);
          if (!msgPacket.id) return;
          msgPacket.type = "markSeen";
          const socketpacket: websocketPacket = {
            type: "chat",
            data: msgPacket,
          };
          send(JSON.stringify(socketpacket));
          setMessages((prev) => prev.filter((msg) => (msg.id === msgPacket.id ? (msg.isRead = true) : msg)));
          observer.unobserve(entry.target);
        }
      });
    });
    document.querySelectorAll("#message").forEach((msg) => {
      observer.observe(msg);
    });
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalReq = error.config;

        if (error.response.status == 401 && error.response.data.error == "JWT_EXPIRED") {
          originalReq._retry = false;
          try {
            const res = await axios.post("https://localhost:5000/jwt/new", {}, { withCredentials: true });
            console.log(res);
            return axios(originalReq);
          } catch (error) {
            console.log(error);
            const navigate = useNavigate();
            navigate("/login");
          }
        }
        return Promise.reject(error);
      }
    );
  }, [messages]);
  function handleChat(packet: websocketPacket) {
    console.log("received msg -> ", packet);
    if (packet.type != "chat") return;
    const newMsg: messagePacket = packet.data;
    if (newMsg.type === "message") {
      console.log("newMsg.recipient_id ", newMsg.recipient_id);
      console.log("currUserRef.current?.id ", currUserRef.current?.id);
      console.log("newMsg.sender_id ", newMsg.sender_id);
      console.log("targetUserRef.current?.id ", targetUserRef.current?.id);
      console.log("condition -> ", newMsg.recipient_id == currUserRef.current?.id);
      console.log("condition 2 -> ", newMsg.sender_id == targetUserRef.current?.id);
      if (newMsg.recipient_id == currUserRef.current?.id && newMsg.sender_id == targetUserRef.current?.id) {
        setMessages((prev) => [newMsg, ...prev]);
      }
      setUsers((prev: UsersLastMessage[]) => {
        const index = prev.findIndex((u) => u.user.id === newMsg.sender_id);
        if (index == -1) return prev;
        const updatedUser: UsersLastMessage = {
          ...prev[index],
          lastMessage: newMsg,
          unreadCount:
            prev[index].unreadCount +
            (newMsg.recipient_id == currUserRef.current?.id && newMsg.sender_id == targetUserRef.current?.id ? 0 : 1),
        };
        const copy = [...prev];
        copy.splice(index, 1);
        copy.unshift(updatedUser);
        return copy;
      });
    } else if (newMsg.type == "markSeen") {
      setMessages((prev) => {
        return prev.map((msg: messagePacket) => {
          return msg.id && msg.id == newMsg.id ? { ...msg, isRead: true, isDelivered: true } : msg;
        });
      });
      setUsers((prev: UsersLastMessage[]) => {
        const index = prev.findIndex((u) => u.user.id === newMsg.recipient_id && u.lastMessage?.id == newMsg.id);
        if (index == -1) return prev;
        if (prev[index].lastMessage) prev[index].lastMessage!.isRead = true;
        return prev;
      });
    } else if (newMsg.type == "markDelivered") {
      setMessages((prev) => {
        return prev.map((msg: messagePacket) => {
          return msg.tempId == newMsg.tempId ? { ...msg, id: newMsg.id, isDelivered: true } : msg;
        });
      });
      setUsers((prev: UsersLastMessage[]) => {
        const index = prev.findIndex(
          (u) => u.user.id === newMsg.recipient_id && u.lastMessage?.tempId == newMsg.tempId
        );
        if (index == -1) return prev;
        if (prev[index].lastMessage) {
          prev[index].lastMessage!.id = newMsg.id;
          prev[index].lastMessage!.isDelivered = true;
        }
        return prev;
      });
    }
  }

  function updateNotification() {
    if (!targetUserRef.current || !currUser) return;
    const notif: websocketPacket = {
      type: "notification",
      data: {
        id: 0,
        type: "markSeen",
        username: "",
        sender_id: targetUserRef.current.id,
        recipient_id: currUser.id,
        message: "",
        createdAt: "",
      },
    };
    send(JSON.stringify(notif));
  }

  function sendMsg(event: React.KeyboardEvent) {
    if (!currUser) return;
    if (event.key == "Enter") {
      const input = document.getElementById("msg") as HTMLInputElement | null;
      if (input && input.value != "" && targetUser) {
        const message: string = input.value;
        const msgPacket: messagePacket = {
          tempId: uuidv4(),
          type: "message",
          isDelivered: false,
          sender_id: currUser.id,
          recipient_id: targetUser.id,
          message: message,
          isRead: false,
          createdAt: new Date().toISOString().replace("T", " ").split(".")[0],
        };
        setUsers((prev: UsersLastMessage[]) => {
          const index = prev.findIndex((u) => u.user.id === msgPacket.recipient_id);
          if (index == -1) return prev;
          const updatedUser: UsersLastMessage = {
            ...prev[index],
            lastMessage: msgPacket,
          };
          const copy = [...prev];
          copy.splice(index, 1);
          copy.unshift(updatedUser);
          return copy;
        });
        const socketPacket: websocketPacket = {
          type: "chat",
          data: msgPacket,
        };
        setMessages((prev) => [msgPacket, ...prev]);
        send(JSON.stringify(socketPacket));
        input.value = "";
      }
    }
  }
  return (
    <div className="flex flex-row h-full w-full bg-darkBg p-5 gap-x-4 font-poppins">
      <div className="flex flex-col bg-compBg/20 basis-1/3 rounded-xl p-3 gap-5">
        <div className="flex flex-row justify-between items-center p-3">
          <div className="flex flex-row gap-1">
            <h2 className="text-white font-semibold text-[24px]">Messaging</h2>
            <div className="w-[9px] h-[9px] rounded-full bg-red-600 mt-2"></div>
          </div>
          <IoFilter className="text-white w-[20px] h-[20px]" />
        </div>
        <div className="flex p-4 flex-row bg-neon/[35%] items-center h-[45px] rounded-full mx-3">
          <FaSearch className="text-white w-[15px] h-[15px]" />
          <input
            type="text"
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for users..."
            className="w-full pl-3 h-[45px] placeholder-[#fff]/[40%] focus:outline-none rounded-full bg-transparent text-white"
          />
        </div>
        <div className="overflow-y-auto pr-4 p-3 scrollbar-thin scrollbar scrollbar-thumb-neon/80 scrollbar-track-white/10 ">
          {users
            .filter((user) => user.user.username.includes(searchInput))
            .map((user, i, arr) => (
              <div key={user.user.id}>
                <UserBubble
                  createdAt={user.lastMessage?.createdAt}
                  unreadCount={user.unreadCount}
                  isRead={user.lastMessage?.isRead}
                  isDelivered={user.lastMessage?.isDelivered}
                  type={
                    user.lastMessage
                      ? user.lastMessage.sender_id == currUser?.id
                        ? "sender"
                        : "recipient"
                      : "recipient"
                  }
                  onclick={() => {
                    setTargetUser(user.user);
                    targetUserRef.current = user.user;
                    user.unreadCount = 0;
                    updateNotification();
                  }}
                  msg={
                    user.lastMessage
                      ? user.lastMessage.sender_id == currUser?.id
                        ? "You : " + user.lastMessage.message
                        : user.lastMessage.message
                      : "Start a Conversation now!"
                  }
                  name={user.user.username}
                  style={`transform h-[85px] ${
                    user.user != targetUser ? "hover:scale-105 hover:bg-neon/[35%]" : "scale-105 bg-neon/[35%]"
                  } transition duration-300 flex flex-row p-5 gap-3 items-center bg-compBg/[25%] rounded-xl`}
                />
                {i + 1 < arr.length ? (
                  <hr className="border-t border-[0.5px] border-[#76767C] my-[6px] mx-6 rounded-full" />
                ) : null}
              </div>
            ))}
        </div>
      </div>
      <div className="bg-compBg/20 rounded-xl  flex-1 flex flex-col justify-between min-w-0">
        {targetUser ? (
          <>
            <div className="bg-compBg/20 h-[95px] items-center flex px-7 justify-between ">
              <div className="flex gap-3 items-center">
                <img src="/src/assets/photo.png" className="h-[44px] w-[44px]" />
                <div className="flex flex-col">
                  <h3 className="font-semibold text-white">{targetUser.username}</h3>
                  <div className="flex gap-1">
                    <div className="w-[9px] h-[9px] rounded-full bg-green-600 mt-2"></div>
                    <p className="text-[#BABABA]">Online</p>
                  </div>
                </div>
              </div>
              <IoIosMore className="text-white h-6 w-6" />
            </div>
            <div
              id="messages"
              className="overflow-y-auto flex flex-col-reverse p-6 gap-1 space-y-reverse h-full scrollbar-thin scrollbar scrollbar-thumb-neon/80 scrollbar-track-white/10 "
            >
              {messages.map((message, i, arr) =>
                message.recipient_id == targetUser.id ? (
                  i == 0 || arr[i - 1].recipient_id != targetUser.id ? (
                    <div
                      key={message.id ?? message.tempId}
                      className="self-start gap-1 break-all wrap-anywhere text-wrap bg-neon/[55%] flex flex-row text-white px-4 py-2 rounded-2xl rounded-tl-sm "
                    >
                      <ChatBubble type="sender" message={message} />
                    </div>
                  ) : i + 1 < arr.length && arr[i + 1].recipient_id == targetUser.id ? (
                    <div
                      key={message.id ?? message.tempId}
                      className="self-start gap-1  break-all wrap-anywhere text-wrap flex flex-row bg-neon/[55%] text-white px-4 py-2 rounded-2xl rounded-tl-sm rounded-bl-sm"
                    >
                      <ChatBubble type="sender" message={message} />
                    </div>
                  ) : (
                    <div
                      key={message.id ?? message.tempId}
                      className="self-start gap-1  break-all wrap-anywhere text-wrap flex flex-row bg-neon/[55%] text-white px-4 py-2 rounded-2xl rounded-bl-sm"
                    >
                      <ChatBubble type="sender" message={message} />
                    </div>
                  )
                ) : i == 0 || arr[i - 1].recipient_id == targetUser.id ? (
                  <div
                    id={!message.isRead ? "message" : ""}
                    key={message.id}
                    data-message={JSON.stringify(message)}
                    className="bg-neon/[22%] gap-1 self-end break-all wrap-anywhere text-wrap flex flex-row text-white px-4 py-2 rounded-2xl rounded-tr-sm"
                  >
                    <ChatBubble type="recipient" message={message} />
                  </div>
                ) : i + 1 < arr.length && arr[i + 1].recipient_id != targetUser.id ? (
                  <div
                    id={!message.isRead ? "message" : ""}
                    key={message.id}
                    data-message={JSON.stringify(message)}
                    className="self-end break-all wrap-anywhere text-wrap flex flex-row bg-neon/[22%] gap-1 text-white px-4 py-2 rounded-2xl rounded-tr-sm rounded-br-sm"
                  >
                    <ChatBubble type="recipient" message={message} />
                  </div>
                ) : (
                  <div
                    id={!message.isRead ? "message" : ""}
                    key={message.id}
                    data-message={JSON.stringify(message)}
                    className="bg-neon/[22%] gap-1 self-end break-all wrap-anywhere text-wrap flex flex-row text-white px-4 py-2 rounded-2xl rounded-br-sm"
                  >
                    <ChatBubble type="recipient" message={message} />
                  </div>
                )
              )}
            </div>
            <div className="bg-compBg/20 h-[95px] items-center flex px-5 justify-between">
              <div className="flex p-1 flex-row bg-neon/[35%] items-center pr-4 w-full rounded-full">
                <input
                  type="text"
                  id="msg"
                  onKeyDown={sendMsg}
                  placeholder="Type your message..."
                  className="w-full p-4 pr-2 h-[45px] focus:outline-none rounded-full bg-transparent text-white placeholder-[#fff]/[40%]"
                />
                <RiSendPlaneFill className="text-white w-[20px] h-[20px]" />
              </div>
            </div>
          </>
        ) : (
          <div className="flex gap-3 flex-col justify-center w-full h-full items-center">
            <img src="/src/assets/chat_bg.png" className="w-2/3" />
            <h2 className="text-white text-[30px] text-center font-semibold">
              Select a conversation to start chatting ✨
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
