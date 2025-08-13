import { IoFilter } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { IoIosMore } from "react-icons/io";
import { RiSendPlaneFill } from "react-icons/ri";
import ChatBubble from "./chatBubble";

const Chat = () => {
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
          <div className="transform h-[85px] hover:scale-105 transition duration-300 flex flex-row p-5 gap-3 hover:bg-neon/[35%] items-center bg-compBg/[25%] rounded-xl">
            <img src="src/assets/photo.png" className="h-[44px] w-[44px]" />
            <div className="w-full">
              <div className="flex flex-row justify-between items-center">
                <h3 className="text-white font-medium">Jakob Saris</h3>
                <p className="text-[#76767C] text-[13px]">5m ago</p>
              </div>
              <div className="flex flex-row justify-between items-center">
                <p className="text-[#76767C] text-[13px] truncate text-ellipsis w-40">
                  You : Sure! let me start the 1v1!
                </p>
                <IoCheckmarkDoneOutline className="text-[#3469F9] w-[15px] h-[15px]" />
              </div>
            </div>
          </div>
          <hr className="border-t border-[0.5px] border-[#76767C] my-[6px] mx-6 rounded-full" />
          <ChatBubble
            msg="You : Sure! let me start the 1v1!"
            name="Jakob Saris"
          />
          <hr className="border-t border-[0.5px] border-[#76767C] my-[6px] mx-6 rounded-full" />
          <ChatBubble
            msg="You : Sure! let me start the 1v1!"
            name="Jakob Saris"
          />
          <hr className="border-t border-[0.5px] border-[#76767C] my-[6px] mx-6 rounded-full" />
          <ChatBubble
            msg="You : Sure! let me start the 1v1!"
            name="Jakob Saris"
          />
          <hr className="border-t border-[0.5px] border-[#76767C] my-[6px] mx-6 rounded-full" />
          <ChatBubble
            msg="You : Sure! let me start the 1v1!"
            name="Jakob Saris"
          />
          <hr className="border-t border-[0.5px] border-[#76767C] my-[6px] mx-6 rounded-full" />
          <ChatBubble
            msg="You : Sure! let me start the 1v1!"
            name="Jakob Saris"
          />
          <hr className="border-t border-[0.5px] border-[#76767C] my-[6px] mx-6 rounded-full" />
          <ChatBubble
            msg="You : Sure! let me start the 1v1!"
            name="Jakob Saris"
          />
          <hr className="border-t border-[0.5px] border-[#76767C] my-[6px] mx-6 rounded-full" />
          <ChatBubble
            msg="You : Sure! let me start the 1v1!"
            name="Jakob Saris"
          />
          <hr className="border-t border-[0.5px] border-[#76767C] my-[6px] mx-6 rounded-full" />
          <ChatBubble
            msg="You : Sure! let me start the 1v1!"
            name="Jakob Saris"
          />
          <hr className="border-t border-[0.5px] border-[#76767C] my-[6px] mx-6 rounded-full" />
          <ChatBubble
            msg="You : Sure! let me start the 1v1!"
            name="Jakob Saris"
          />
          <hr className="border-t border-[0.5px] border-[#76767C] my-[6px] mx-6 rounded-full" />
          <ChatBubble
            msg="You : Sure! let me start the 1v1!"
            name="Jakob Saris"
          />
          <hr className="border-t border-[0.5px] border-[#76767C] my-[6px] mx-6 rounded-full" />
          <ChatBubble
            msg="You : Sure! let me start the 1v1!"
            name="Jakob Saris"
          />
          <hr className="border-t border-[0.5px] border-[#76767C] my-[6px] mx-6 rounded-full" />
          <ChatBubble
            msg="You : Sure! let me start the 1v1!"
            name="Jakob Saris"
          />
          <hr className="border-t border-[0.5px] border-[#76767C] my-[6px] mx-6 rounded-full" />
        </div>
      </div>
      <div className="h-full bg-compBg/20 basis-2/3 rounded-xl flex flex-col justify-between">
        <div className="bg-compBg/20 h-[95px] items-center flex px-7 justify-between">
          <div className="flex gap-3 items-center">
            <img src="src/assets/photo.png" className="h-[44px] w-[44px]" />
            <div className="flex flex-col">
              <h3 className="font-semibold text-white">Jason wang</h3>
              <div className="flex gap-1">
                <div className="w-[9px] h-[9px] rounded-full bg-green-600 mt-2"></div>
                <p className="text-[#BABABA]">Online</p>
              </div>
            </div>
          </div>
          <IoIosMore className="text-white h-6 w-6" />
        </div>
        <div className="flex flex-col-reverse p-6 gap-3 h-screen space-y-reverse">
          {/* Sender */}
          <div className="flex flex-col gap-1 items-start">
            <p className="bg-neon/[55%]  text-white px-4 py-2 rounded-2xl rounded-bl-none max-w-xs">
              Hey! How arebfssbvgvghfgh;sghs yougfhfj;ghfj;hglslhf?
            </p>
            <div className="self-start bg-neon/[55%] text-white px-4 py-2 rounded-2xl rounded-tl-sm rounded-bl-sm max-w-xs">
              Did you see the news?
            </div>
            <p className="text-[#757575]">Today 11:55</p>
          </div>
          {/* Receiver */}
          <div className="flex flex-col gap-1 items-end">
            <p className="bg-neon/[22%] text-white px-4 py-2 rounded-2xl rounded-br-none">
              I'm good, what about you?
            </p>
            <p className="text-[#757575]">Today 11:55</p>
          </div>
          {/* Sender */}
          <div className="flex flex-col gap-1 items-start">
            <p className="bg-neon/[55%]  text-white px-4 py-2 rounded-2xl rounded-bl-none max-w-xs">
              Hey! How arebfssbvgvghfgh;sghs yougfhfj;ghfj;hglslhf?
            </p>
            <div className="self-start bg-neon/[55%] text-white px-4 py-2 rounded-2xl rounded-tl-sm rounded-bl-sm max-w-xs">
              Did you see the news?
            </div>
            <p className="text-[#757575]">Today 11:55</p>
          </div>
          {/* Receiver */}
          <div className="flex flex-col gap-1 items-end">
            <p className="bg-neon/[22%] text-white px-4 py-2 rounded-2xl rounded-br-none">
              I'm good, what about you?
            </p>
            <p className="text-[#757575]">Today 11:55</p>
          </div>
        </div>
        <div className="bg-compBg/20 h-[95px] items-center flex px-5 justify-between">
          <div className="flex p-1 flex-row bg-neon/[35%] items-center pr-4 w-full rounded-full">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full p-4 pr-2 h-[45px] focus:outline-none rounded-full bg-transparent text-white"
            />
            <RiSendPlaneFill className="text-white w-[20px] h-[20px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
