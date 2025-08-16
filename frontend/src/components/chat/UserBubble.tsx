import { IoCheckmarkDoneOutline } from "react-icons/io5";

interface props {
  msg: string;
  name: string;
  onclick: () => void;
  style: string;
}

const UserBubble = ({ msg, name, onclick, style }: props) => {
  return (
    <div onClick={onclick} className={style}>
      <img src="src/assets/photo.png" className="h-[44px] w-[44px]" />
      <div className="w-full">
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-white font-medium">{name}</h3>
          <p className="text-[#76767C] text-[13px]">5m ago</p>
        </div>
        <div className="flex flex-row justify-between items-center">
          <p className="text-[#76767C] text-[13px] truncate text-ellipsis w-40">
            {msg}
          </p>
          <IoCheckmarkDoneOutline className="text-[#3469F9] w-[15px] h-[15px]" />
        </div>
      </div>
    </div>
  );
};

export default UserBubble;
