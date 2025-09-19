interface props {
  inGame: boolean;
  isOnline: boolean;
}

const FriendBubble = ({ inGame, isOnline }: props) => {
  return (
    <div className="relative w-[55px] h-[55px] bg-[#FFDCB9] rounded-full">
      <div
        className={`absolute w-[12px] h-[12px] rounded-full top-0 right-0 ${
          isOnline ? "bg-[#00FF38]" : "bg-[#A5BAA9]"
        } border-compBg mt-2`}
      ></div>
      <img src="/src/assets/fr1.png" />
      {inGame ? (
        <div className="absolute top-[45px] w-[60px] h-[22px] bg-neon rounded-[6px] text-white text-[12px] flex justify-center items-center font-medium">
          In Game
        </div>
      ) : null}
    </div>
  );
};

export default FriendBubble;
