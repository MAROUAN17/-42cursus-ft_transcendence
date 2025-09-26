import { BsPersonFillAdd } from "react-icons/bs";

const LogCard = () => {
  return (
    <div className="px-5 py-4 rounded-full bg-compBg flex gap-3 items-center">
      <img src="/profile1.jpg" className="h-[60px] w-[60px] rounded-full object-cover" />
      <div className="text-white w-full">
        <h2 className="font-bold">Player1</h2>
        <p className="text-white/80 font-light">
          Player1 <span className="font-bold">Won</span> The Tournament <span className="font-bold">1337Gang</span>
        </p>
      </div>
      <div className="mr-2 gap-1 flex flex-col justify-end items-end">
        <p className="text-white/50  text-[10px] w-10 ">5m ago</p>
        <BsPersonFillAdd className="text-white h-[25px] w-[25px]" />
      </div>
    </div>
  );
};

export default LogCard;
