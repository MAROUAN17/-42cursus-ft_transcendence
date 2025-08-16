import { IoFilter } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { IoIosMore } from "react-icons/io";
import { RiSendPlaneFill } from "react-icons/ri";
import UserBubble from "./UserBubble";
import { IoCheckmark } from "react-icons/io5";
import type { User } from "../../../../backend/src/models/user";
import { useState, useEffect } from "react";
import axios from "axios";
import type { messagePacket } from "../../../../backend/src/models/chat";
import ChatBubble from "./ChatBubble";
import { v4 as uuidv4 } from "uuid";

const Chat = () => {
  const [messages, setMessages] = useState<messagePacket[]>([]);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [targetUser, setTargetUser] = useState<User | null>();
  const [currUser, setCurrUser] = useState<User>();
  useEffect(() => {
    if (!targetUser) return;
    axios("http://localhost:8088/messages/" + targetUser.username, {
      withCredentials: true,
    })
      .then((res) => {
        setMessages(res.data.data);
      })
      .catch((error) => console.error("Error fetching messages:", error));
  }, [targetUser]);

  useEffect(() => {
    axios("http://localhost:8088/user", { withCredentials: true })
      .then((res) => {
        setCurrUser(res.data.infos);
      })
      .catch((error) => console.error("Error fetching user:", error));
    axios("http://localhost:8088/users", { withCredentials: true })
      .then((res) => {
        setUsers(res.data.data);
      })
      .catch((error) => console.error("Error fetching users:", error));

    const ws = new WebSocket("ws://localhost:8088/send-message");
    ws.onopen = () => {
      console.log("Websocket Connected!");
      setWebsocket(ws);
    };
    ws.onmessage = (event) => {
      const newMsg: messagePacket = JSON.parse(event.data.toString());
      if (newMsg.type === "message") setMessages((prev) => [newMsg, ...prev]);
      else if (newMsg.type == "markSeen") {
        console.log("got message seen ->", newMsg);
        console.log("got message seen id ->", newMsg.id);
        setMessages((prev) => {
          return prev.map((msg: messagePacket) => {
            return msg.id && msg.id == newMsg.id
              ? { ...msg, isRead: true, isDelivered: true }
              : msg;
          });
        });
      } else if (newMsg.type == "markDelivered") {
        setMessages((prev) => {
          return prev.map((msg: messagePacket) => {
            return msg.tempId == newMsg.tempId
              ? { ...msg, id: newMsg.id, isDelivered: true }
              : msg;
          });
        });
      }
    };
    return () => {
      console.log("Closing WebSocket...");
      ws.close();
    };
  }, []);
  useEffect(() => {
    console.log("mesages => ", messages);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const messageObj: string | null =
            entry.target.getAttribute("data-message");
          if (!messageObj) return;
          const msgPacket: messagePacket = JSON.parse(messageObj);
          console.log("before id msg id -> ", msgPacket.id);
          if (!msgPacket.id) return;
          console.log("after id msg id -> ", msgPacket.id);
          msgPacket.type = "markSeen";
          if (websocket && websocket.readyState == WebSocket.OPEN)
            websocket.send(JSON.stringify(msgPacket));
          observer.unobserve(entry.target);
        }
      });
    });
    document.querySelectorAll("#message").forEach((msg) => {
      observer.observe(msg);
    });
  }, [messages]);
  function sendMsg(event: React.KeyboardEvent) {
    if (event.key == "Enter") {
      const input = document.getElementById("msg") as HTMLInputElement | null;
      if (input && input.value != "" && targetUser) {
        const message: string = input.value;
        const msgPacket: messagePacket = {
          tempId: uuidv4(),
          type: "message",
          isDelivered: false,
          to: targetUser.username,
          message: message,
          isRead: false,
        };
        setMessages((prev) => [msgPacket, ...prev]);
        if (websocket && websocket.readyState == WebSocket.OPEN)
          websocket.send(JSON.stringify(msgPacket));
        input.value = "";
      }
    }
  }

  return (
    <div className="flex  flex-row h-screen bg-darkBg p-5 gap-x-4 font-poppins">
      <div className="h-full flex flex-col bg-compBg/20 basis-1/3 rounded-xl p-3 gap-5">
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
            placeholder="Search in messages..."
            className="w-full pl-3 h-[45px] focus:outline-none rounded-full bg-transparent text-white"
          />
        </div>
        <div className="overflow-y-auto pr-4 p-3 scrollbar-thin scrollbar scrollbar-thumb-neon/80 scrollbar-track-white/10 ">
          {users.map((user, i, arr) =>
            user.username != currUser?.username ? (
              <div key={user.id}>
                <UserBubble
                  onclick={() => setTargetUser(user)}
                  msg="You : Sure! let me start the 1v1!"
                  name={user.username}
                  style={`transform h-[85px] ${
                    user != targetUser
                      ? "hover:scale-105 hover:bg-neon/[35%]"
                      : "scale-105 bg-neon/[35%]"
                  } transition duration-300 flex flex-row p-5 gap-3 items-center bg-compBg/[25%] rounded-xl`}
                />
                {i + 1 < arr.length ? (
                  <hr className="border-t border-[0.5px] border-[#76767C] my-[6px] mx-6 rounded-full" />
                ) : null}
              </div>
            ) : null
          )}
        </div>
      </div>
      <div className="h-full bg-compBg/20 basis-2/3 rounded-xl flex flex-col justify-between">
        {targetUser ? (
          <>
            <div className="bg-compBg/20 h-[95px] items-center flex px-7 justify-between">
              <div className="flex gap-3 items-center">
                <img src="src/assets/photo.png" className="h-[44px] w-[44px]" />
                <div className="flex flex-col">
                  <h3 className="font-semibold text-white">
                    {targetUser.username}
                  </h3>
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
              className="overflow-y-auto flex flex-col-reverse p-6 gap-1 h-screen space-y-reverse scrollbar-thin scrollbar scrollbar-thumb-neon/80 scrollbar-track-white/10 "
            >
              {messages.map((message, i, arr) =>
                message.to == targetUser.username ? (
                  i == 0 || arr[i - 1].to != targetUser.username ? (
                    <div
                      key={message.id ?? message.tempId}
                      className="self-start gap-1 break-all wrap-anywhere text-wrap bg-neon/[55%] flex flex-row text-white px-4 py-2 rounded-2xl rounded-tl-sm "
                    >
                      <ChatBubble
                        isDelivered={message.isDelivered}
                        type="sender"
                        msg={message.message}
                        isRead={message.isRead}
                      />
                    </div>
                  ) : i + 1 < arr.length &&
                    arr[i + 1].to == targetUser.username ? (
                    <div
                      key={message.id ?? message.tempId}
                      className="self-start gap-1  break-all wrap-anywhere text-wrap flex flex-row bg-neon/[55%] text-white px-4 py-2 rounded-2xl rounded-tl-sm rounded-bl-sm"
                    >
                      <ChatBubble
                        isDelivered={message.isDelivered}
                        type="sender"
                        msg={message.message}
                        isRead={message.isRead}
                      />
                    </div>
                  ) : (
                    <div
                      key={message.id ?? message.tempId}
                      className="self-start gap-1  break-all wrap-anywhere text-wrap flex flex-row bg-neon/[55%] text-white px-4 py-2 rounded-2xl rounded-bl-sm"
                    >
                      <ChatBubble
                        isDelivered={message.isDelivered}
                        type="sender"
                        msg={message.message}
                        isRead={message.isRead}
                      />
                    </div>
                  )
                ) : i == 0 || arr[i - 1].to == targetUser.username ? (
                  <div
                    id={!message.isRead ? "message" : ""}
                    key={message.id}
                    data-message={JSON.stringify(message)}
                    className="bg-neon/[22%] gap-1 self-end break-all wrap-anywhere text-wrap flex flex-row text-white px-4 py-2 rounded-2xl rounded-tr-sm"
                  >
                    <ChatBubble
                      type="recipient"
                      msg={message.message}
                      isRead={message.isRead}
                    />
                  </div>
                ) : i + 1 < arr.length &&
                  arr[i + 1].to != targetUser.username ? (
                  <div
                    id={!message.isRead ? "message" : ""}
                    key={message.id}
                    data-message={JSON.stringify(message)}
                    className="self-end break-all wrap-anywhere text-wrap flex flex-row bg-neon/[22%] gap-1 text-white px-4 py-2 rounded-2xl rounded-tr-sm rounded-br-sm"
                  >
                    <ChatBubble
                      type="recipient"
                      msg={message.message}
                      isRead={message.isRead}
                    />
                  </div>
                ) : (
                  <div
                    id={!message.isRead ? "message" : ""}
                    key={message.id}
                    data-message={JSON.stringify(message)}
                    className="bg-neon/[22%] gap-1 self-end break-all wrap-anywhere text-wrap flex flex-row text-white px-4 py-2 rounded-2xl rounded-br-sm"
                  >
                    <ChatBubble
                      type="recipient"
                      msg={message.message}
                      isRead={message.isRead}
                    />
                  </div>
                )
              )}
              {/* Sender */}
              {/* <div className="flex flex-col gap-1 items-start">
                <p className="bg-neon/[55%]  text-white px-4 py-2 rounded-2xl rounded-bl-none max-w-xs">
                  Hey! How arebfssbvgvghfgh;sghs yougfhfj;ghfj;hglslhf?
                </p>
                <div className="self-start bg-neon/[55%] text-white px-4 py-2 rounded-2xl rounded-tl-sm rounded-bl-sm max-w-xs">
                  Did you see the news?
                </div>
                <p className="text-[#757575]">Today 11:55</p>
              </div> */}
            </div>
            <div className="bg-compBg/20 h-[95px] items-center flex px-5 justify-between">
              <div className="flex p-1 flex-row bg-neon/[35%] items-center pr-4 w-full rounded-full">
                <input
                  type="text"
                  id="msg"
                  onKeyDown={sendMsg}
                  placeholder="Type your message..."
                  className="w-full p-4 pr-2 h-[45px] focus:outline-none rounded-full bg-transparent text-white"
                />
                <RiSendPlaneFill className="text-white w-[20px] h-[20px]" />
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Chat;
