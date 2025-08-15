import { IoFilter } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { IoIosMore } from "react-icons/io";
import { RiSendPlaneFill } from "react-icons/ri";
import ChatBubble from "./chatBubble";
import { dbConnection } from "../../../../backend/src/plugins/db";
import type { User } from "../../../../backend/src/models/user";
import { useState, useEffect } from "react";
import axios from "axios";
import type { messagePacket } from "../../../../backend/src/models/chat";
import { userInfos } from "../user/login";

const Chat = () => {
  interface props {
    source: "sender" | "receiver";
    content: string;
  }
  const [messages, setMessages] = useState<messagePacket[]>([]);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currUser, setCurrUser] = useState<User | null>();
  useEffect(() => {
    if (!currUser) return;
    axios("http://localhost:8088/messages/" + currUser.email, { withCredentials: true })
      .then((res) => {
        setMessages(res.data.data);
      })
      .catch((error) => console.error("Error fetching messages:", error));
  }, [currUser]);

  useEffect(() => {
    axios("http://localhost:8088/users", { withCredentials: true })
      .then((res) => {
        setUsers(res.data.data);
        console.log(res.data.data);
      })
      .catch((error) => console.error("Error fetching users:", error));

    const ws = new WebSocket("ws://localhost:8088/send-message");
    ws.onopen = () => {
      console.log("Websocket Connected!");
      setWebsocket(ws);
    };
    ws.onmessage = (event) => {
      const newMsg : messagePacket = JSON.parse(event.data.toString())
      setMessages((prev) => [
        newMsg,
        ...prev,
      ]);
    };
    return () => {
      console.log("Closing WebSocket...");
      ws.close();
    };
  }, []);
  function sendMsg(event: React.KeyboardEvent) {
    if (event.key == "Enter") {
      const input = document.getElementById("msg") as HTMLInputElement | null;
      if (input && input.value != "" && currUser) {
        const message: string = input.value;
        const msgPacket: messagePacket = {
          from: "",
          to: currUser.email,
          message: message,
        };
        setMessages((prev) => [
          msgPacket,
          ...prev,
        ]);
        if (websocket && websocket.readyState == WebSocket.OPEN)
          websocket.send(JSON.stringify(msgPacket));
        input.value = "";
      }
    }
  }
  console.log("User info -> ",userInfos);

  return (
    <div className="flex  flex-row h-screen bg-darkBg p-5 gap-x-4 font-poppins">
      <div className="h-full flex flex-col bg-compBg/20 basis-1/3 rounded-xl p-3 gap-5">
        <div className="flex flex-row justify-between items-center p-3">
          <div className="flex flex-row gap-1">
            <h2 className="text-white font-semibold text-[24px]">Messaging</h2>
            <div className="w-[9px] h-[9px] rounded-full bg-red-600 mt-2"></div>
          </div>
          {/* <img src="src/assets/sort.png" className="w-[30px] h-[30px]" /> */}
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
          {users.map((user, i, arr) => (
            <>
              <ChatBubble
                onclick={() => setCurrUser(user)}
                msg="You : Sure! let me start the 1v1!"
                name={user.username || "unkonwn"}
              />
              {i + 1 < arr.length ? (
                <hr className="border-t border-[0.5px] border-[#76767C] my-[6px] mx-6 rounded-full" />
              ) : null}
            </>
          ))}
        </div>
      </div>
      <div className="h-full bg-compBg/20 basis-2/3 rounded-xl flex flex-col justify-between">
        {currUser ? (
          <>
            <div className="bg-compBg/20 h-[95px] items-center flex px-7 justify-between">
              <div className="flex gap-3 items-center">
                <img src="src/assets/photo.png" className="h-[44px] w-[44px]" />
                <div className="flex flex-col">
                  <h3 className="font-semibold text-white">
                    {currUser.username}
                  </h3>
                  <div className="flex gap-1">
                    <div className="w-[9px] h-[9px] rounded-full bg-green-600 mt-2"></div>
                    <p className="text-[#BABABA]">Online</p>
                  </div>
                </div>
              </div>
              <IoIosMore className="text-white h-6 w-6" />
            </div>
            <div className=" overflow-y-auto flex flex-col-reverse p-6 gap-1 h-screen space-y-reverse scrollbar-thin scrollbar scrollbar-thumb-neon/80 scrollbar-track-white/10 ">
              {messages.map((message, i, arr) =>
                message.to == currUser.email ? (
                  i == 0 || arr[i - 1].to != currUser.email ? (
                    <div className="self-start bg-neon/[55%] text-white px-4 py-2 rounded-2xl rounded-tl-sm max-w-xs">
                      {message.message}
                    </div>
                  ) : i + 1 < arr.length && arr[i + 1].to == currUser.email ? (
                    <div className="self-start bg-neon/[55%] text-white px-4 py-2 rounded-2xl rounded-tl-sm rounded-bl-sm max-w-xs">
                      {message.message}
                    </div>
                  ) : (
                    <div className="self-start bg-neon/[55%] text-white px-4 py-2 rounded-2xl rounded-bl-sm max-w-xs">
                      {message.message}
                    </div>
                  )
                ) : i == 0 || arr[i - 1].to == currUser.email ? (
                  <div className="bg-neon/[22%] max-w-xs self-end text-white px-4 py-2 rounded-2xl rounded-tr-sm">
                    {message.message}
                  </div>
                ) : i + 1 < arr.length && arr[i + 1].to != currUser.email ? (
                  <div className="self-end bg-neon/[22%] text-white px-4 py-2 rounded-2xl rounded-tr-sm rounded-br-sm max-w-xs">
                    {message.message}
                  </div>
                ) : (
                  <div className="bg-neon/[22%] self-end text-white px-4 py-2 rounded-2xl rounded-br-sm max-w-xs">
                    {message.message}
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
