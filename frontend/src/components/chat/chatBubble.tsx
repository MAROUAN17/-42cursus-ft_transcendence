import { IoCheckmark, IoCheckmarkDoneOutline } from "react-icons/io5";

interface props {
  type: "sender" | "recipient";
  msg: string;
  isRead: boolean;
  isDelivered?: boolean;
}

const ChatBubble = ({ msg, isRead, type, isDelivered }: props) => {
  return (
    <>
      <p className="max-w-xs">{msg}</p>
      <p className="text-[#fff]/[40%] text-[12px] self-end">11:06 pm</p>

      {type == "sender" ? (
        isDelivered ? (
          <IoCheckmarkDoneOutline
            className={`${
              isRead ? "text-[#3469F9]" : "text-[#fff]/[40%]"
            } self-end w-[16px] h-[16px]`}
          />
        ) : (
          <IoCheckmark className="text-[#fff]/[40%] self-end w-[16px] h-[16px" />
        )
      ) : null}
    </>
  );
};

export default ChatBubble;
