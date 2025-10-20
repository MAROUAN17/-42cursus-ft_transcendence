import { IoCheckmark, IoCheckmarkDoneOutline } from "react-icons/io5";
import type { messagePacket } from "../../types/websocket";

interface props {
  type: "sender" | "recipient";
  message: messagePacket;
  avatar?: string;
  username?: string;
  sendRes: (res: "inviteAccepted" | "inviteDeclined", msgId: number) => void;
}

function isToday(date: Date): boolean {
  const today: Date = new Date();
  return today.getFullYear() == date.getFullYear() && today.getMonth() == date.getMonth() && today.getDate() == date.getDate();
}
function isYesterday(date: Date): boolean {
  const today: Date = new Date();
  const yesterday: Date = new Date();
  yesterday.setDate(today.getDate() - 1);
  return yesterday.getFullYear() == date.getFullYear() && yesterday.getMonth() == date.getMonth() && yesterday.getDate() == date.getDate();
}

const ChatBubble = ({ avatar, username, message, type, sendRes }: props) => {
  const date: Date = new Date(message.createdAt + "Z");

  return message.type == "message" ? (
    <>
      <p className="max-w-xs break-words">{message.message}</p>
      <p className="text-[#fff]/[40%] text-[12px] self-end">
        {!isToday(date) ? (isYesterday(date) ? "yesterday at " : date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate() + ", ") : null}
        {String(date.getHours()).padStart(2, "0")}:{String(date.getMinutes()).padStart(2, "0")}
      </p>
      {type == "sender" ? (
        message.isDelivered ? (
          <IoCheckmarkDoneOutline className={`${message.isRead ? "text-[#3469F9]" : "text-[#fff]/[40%]"} self-end w-[16px] h-[16px]`} />
        ) : (
          <IoCheckmark className="text-[#fff]/[40%] self-end w-[16px] h-[16px]" />
        )
      ) : null}
    </>
  ) : (
    <div className="p-2 flex flex-col gap-3">
      {type == "sender" ? (
        <>
          <div className="flex gap-2 items-center">
            <img src={avatar} className="w-[55px] h-[55px] rounded-full object-cover" />
            <div className="flex flex-col">
              <p className="text-[#fff]/[90%]">
                🏓 You challenged <span className="font-bold">{username}</span> <br /> to a Pong match!
              </p>
              <p className="text-[#fff]/[60%]">Ready for a quick 1v1?</p>
            </div>
          </div>
          <div className="flex justify-between gap-3">
            {message.type == "inviteAccepted" ? (
              <button className="px-5 animate-fadeIn transition-all duration-300 hover:scale-105 py-2 w-full font-bold rounded-lg bg-green-600">
                Accepted
              </button>
            ) : message.type == "inviteDeclined" ? (
              <button className="px-5 animate-fadeIn transition-all duration-300 hover:scale-105 w-full py-2 font-bold rounded-lg bg-white/20">
                Declined
              </button>
            ) : (
              <button className="px-5 animate-fadeIn transition-all duration-300 hover:scale-105 py-2 w-full font-bold rounded-lg bg-white/20">
                Waiting for Response...
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex gap-2 items-center">
            <img src={avatar} className="w-[55px] h-[55px] bg-cover rounded-full object-cover" />
            <div className="flex flex-col">
              <p className="text-[#fff]/[90%]">
                🏓 <span className="font-bold">{username}</span> has challenged you <br /> to a Pong match!
              </p>
              <p className="text-[#fff]/[60%]">Ready for a quick 1v1?</p>
            </div>
          </div>
          <div className="flex justify-between gap-3">
            {message.type == "inviteAccepted" ? (
              <button className="px-5 animate-fadeIn transition-all duration-300 hover:scale-105 py-2 w-full font-bold rounded-lg bg-green-600">
                Accepted
              </button>
            ) : message.type == "inviteDeclined" ? (
              <button className="px-5 animate-fadeIn transition-all duration-300 hover:scale-105 w-full py-2 font-bold rounded-lg bg-red-600">
                Declined
              </button>
            ) : (
              <>
                <button
                  onClick={() => sendRes("inviteDeclined", message.id!)}
                  className="px-5 transition-all duration-300 hover:scale-105 w-full py-2 font-bold rounded-lg bg-red-600"
                >
                  Decline
                </button>
                <button
                  onClick={() => sendRes("inviteAccepted", message.id!)}
                  className="px-5 transition-all duration-300 hover:scale-105 py-2 w-full font-bold rounded-lg bg-green-600"
                >
                  Accept
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBubble;
