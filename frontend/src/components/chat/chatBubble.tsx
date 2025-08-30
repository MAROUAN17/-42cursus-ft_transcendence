import { IoCheckmark, IoCheckmarkDoneOutline } from "react-icons/io5";
import type { messagePacket } from "../../../../backend/src/models/chat";

interface props {
  type: "sender" | "recipient";
  message: messagePacket;
}

function isToday(date: Date): boolean {
  const today: Date = new Date();
  return (
    today.getFullYear() == date.getFullYear() &&
    today.getMonth() == date.getMonth() &&
    today.getDate() == date.getDate()
  );
}
function isYesterday(date: Date): boolean {
  const today: Date = new Date();
  const yesterday: Date = new Date();
  yesterday.setDate(today.getDate() - 1);
  return (
    yesterday.getFullYear() == date.getFullYear() &&
    yesterday.getMonth() == date.getMonth() &&
    yesterday.getDate() == date.getDate()
  );
}

const ChatBubble = ({ message, type }: props) => {
  const date: Date = new Date(message.createdAt + "Z");

  return (
    <>
      <p className="max-w-xs">{message.message}</p>
      <p className="text-[#fff]/[40%] text-[12px] self-end">
        {!isToday(date)
          ? isYesterday(date)
            ? "yesterday at "
            : date.getFullYear() +
              "/" +
              date.getMonth() +
              "/" +
              date.getDate() +
              ", "
          : null}
        {String(date.getHours()).padStart(2, "0")}:
        {String(date.getMinutes()).padStart(2, "0")}
      </p>
      {type == "sender" ? (
        message.isDelivered ? (
          <IoCheckmarkDoneOutline
            className={`${
              message.isRead ? "text-[#3469F9]" : "text-[#fff]/[40%]"
            } self-end w-[16px] h-[16px]`}
          />
        ) : (
          <IoCheckmark className="text-[#fff]/[40%] self-end w-[16px] h-[16px]" />
        )
      ) : null}
    </>
  );
};

export default ChatBubble;
