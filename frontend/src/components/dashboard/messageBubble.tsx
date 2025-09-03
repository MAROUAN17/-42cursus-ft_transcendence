interface props {
  unreadCount: number;
  isOnline: boolean;
}

const MessageBubble = ({ unreadCount, isOnline }: props) => {
  return (
    <div className="relative w-[55px] h-[55px] bg-[#FFDCB9] rounded-full">
      <div
        className={`absolute w-[12px] h-[12px] text-[10px] flex items-center justify-center rounded-full top-0 right-0 ${
          isOnline ? "bg-[#00FF38]" : "bg-[#A5BAA9]"
        } border-compBg mt-2`}
      >
        {unreadCount > 0 ? unreadCount : null}
      </div>
      <img src="/src/assets/fr1.png" />
    </div>
  );
};

export default MessageBubble;
