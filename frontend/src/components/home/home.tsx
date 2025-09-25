import React from "react";
import { FaHome, FaInfoCircle, FaRobot, FaTrophy } from "react-icons/fa";
import { FaArrowRightLong, FaCircleQuestion, FaRankingStar } from "react-icons/fa6";
import { HiLightningBolt } from "react-icons/hi";
import { IoIosChatboxes } from "react-icons/io";
import { RiSwordFill } from "react-icons/ri";
import { TbLayoutDashboardFilled } from "react-icons/tb";

const Home = () => {
  return (
    <div className="bg-[#14121C] font-poppins w-screen min-h-screen flex flex-col">
      <div className="relative w-full h-screen flex flex-col items-center overflow-hidden">
        <div className="text-white z-10 w-full h-fit px-10 py-8 flex justify-between items-center">
          <h1 className="font-bold text-[20px]">Logo</h1>
          <div className="flex font-bebas gap-9">
            <div className="font-medium text-[30px] flex justify-center items-center gap-1">
              <FaHome />
              Home
            </div>
            <div className="font-medium text-[30px] flex justify-center items-center gap-1">
              <FaInfoCircle />
              About
            </div>
            <div className="font-medium text-[30px] flex justify-center items-center gap-1">
              <FaCircleQuestion />
              Features
            </div>
          </div>
          <button
            type="button"
            className="text-white z-10 bg-neon bg-gradient-to-r from-[#B13BFF] to-[#8528FB]/90 shadow-lg shadow-[#B13BFF]/50 font-bold rounded-[16px] px-8 py-2.5 text-center"
          >
            Login
          </button>
        </div>
        <div className="flex flex-col gap-5 z-10 text-white text-center  w-1/3">
          <h1 className="mt-10 font-bebas text-[126px] leading-[100px] font-normal">Think You've Got the Fastest Paddle?</h1>
          <p className="text-[25px] break-keep">
            Join the ultimate online Ping Pong arena. Challenge players in real-time 1v1 matches or climb the tournament ladder to prove you're the
            king of the table.
          </p>
          <div className="flex justify-center items-center gap-5">
            <button
              type="button"
              className="text-white z-10 bg-neon bg-gradient-to-r from-[#B13BFF] text-[30px] to-[#8528FB]/90 shadow-lg shadow-[#B13BFF]/50 font-semibold rounded-[22px] px-8 py-2.5 text-center"
            >
              Play Now
            </button>
            <div className="flex  justify-center font-bebas gap-3 items-center">
              <h3 className="text-[30px] w-fit h-fit ">Learn more</h3>
              <FaArrowRightLong className="" />
            </div>
          </div>
        </div>
        <img
          className="[mask-image:linear-gradient(to_bottom,black_60%,transparent_90%)] object-cover absolute top-0 left-0 w-full mix-blend-color-dodge"
          src="/dust.png"
        />
        <img
          className="[mask-image:linear-gradient(to_bottom,black_60%,transparent_90%)] object-cover absolute top-0 left-0 w-full opacity-80"
          src="/home-bg2.png"
        />
        <img
          className="[mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)] absolute bottom-0 object-contain w-[80%] z-10"
          src="/table.png"
        />
      </div>
      <div className="relative w-full flex flex-col items-center overflow-hidden">
        <img src="/home-bg3.png" className=" object-cover" />
        <img src="/home-bg3.png" className=" object-cover" />
        <div className="absolute top-0 flex gap-6 flex-col items-center">
          <div className="flex flex-col items-center">
            <HiLightningBolt className="text-[#B13BFF] w-[55px] h-[55px]" />
            <h1 className="text-white font-semibold text-[74px]">Features</h1>
            <p className="text-[#94969E] text-[28px] w-2/3 text-center">
              Play, compete, and rise through the ranks. Whether you're here for casual matches or intense tournaments, our game delivers smooth
              controls, real-time action, and a community built for ping pong lovers.
            </p>
          </div>
          <div className="flex mt-5 flex-wrap justify-center gap-16">
            <div>
              <div className="w-[506px] hover:scale-105 transition duration-300 border gap-2 flex flex-col items-center border-[#18181B] rounded-[20px] overflow-hidden h-[509px] bg-[#0E0E10]/[64%]">
                <img src="/feature1.png" alt="" />
                <div className="text-white flex items-center gap-1 font-semibold">
                  <RiSwordFill className="w-[25px] h-[25px]" />
                  <h2 className="text-[25px]">1v1 Battles</h2>
                </div>
                <p className="font-medium text-[20px] text-[#797C86] text-center px-2 w-full h-full">
                  Challenge players from around the world in intense 1v1 ping pong matches. Test your reflexes, sharpen your skills, and climb the
                  leaderboard.
                </p>
              </div>
            </div>
            <div>
              <div className="w-[506px] hover:scale-105 transition duration-300 border gap-2 flex flex-col items-center border-[#18181B] rounded-[20px] overflow-hidden h-[509px] bg-[#0E0E10]/[64%]">
                <img src="/feature2.png" alt="" />
                <div className="text-white flex items-center gap-1 font-semibold">
                  <FaTrophy className="w-[25px] h-[25px]" />
                  <h2 className="text-[25px]">Tournaments</h2>
                </div>
                <p className="font-medium text-[20px] text-[#797C86] text-center px-9 w-full h-full">
                  Compete in tournaments for glory and rewards. Face off against skilled players, and prove you're the true ping pong champion.
                </p>
              </div>
            </div>
            <div>
              <div className="w-[506px] hover:scale-105 transition duration-300 border gap-2 flex flex-col items-center border-[#18181B] rounded-[20px] overflow-hidden h-[509px] bg-[#0E0E10]/[64%]">
                <img src="/feature3.png" alt="" />
                <div className="text-white flex items-center gap-1 font-semibold">
                  <FaRobot className="w-[25px] h-[25px]" />
                  <h2 className="text-[25px]">1vAI Mode</h2>
                </div>
                <p className="font-medium text-[20px] text-[#797C86] text-center px-9 w-full h-full">
                  Train your skills against smart AI opponents. Choose your difficulty, practice your shots, and get ready for real competition.
                </p>
              </div>
            </div>
            <div>
              <div className="w-[506px] hover:scale-105 transition duration-300 border gap-2 flex flex-col items-center border-[#18181B] rounded-[20px] overflow-hidden h-[509px] bg-[#0E0E10]/[64%]">
                <img src="/feature4.png" alt="" />
                <div className="text-white flex items-center gap-1 font-semibold">
                  <FaRankingStar className="w-[25px] h-[25px]" />
                  <h2 className="text-[25px]">Leaderboard</h2>
                </div>
                <p className="font-medium text-[20px] text-[#797C86] text-center px-12 w-full h-full">
                  Climb the ranks and see who's dominating the table. Track top players, challenge rivals, and earn your spot at the top.
                </p>
              </div>
            </div>
            <div>
              <div className="w-[506px] hover:scale-105 transition duration-300 border gap-2 flex flex-col items-center border-[#18181B] rounded-[20px] overflow-hidden h-[509px] bg-[#0E0E10]/[64%]">
                <img src="/feature5.png" alt="" />
                <div className="text-white flex items-center gap-1 font-semibold">
                  <IoIosChatboxes className="w-[25px] h-[25px]" />
                  <h2 className="text-[25px]">Live Chat</h2>
                </div>
                <p className="font-medium text-[20px] text-[#797C86] text-center px-2 w-full h-full">
                  Connect with friends and rivals in real time. Chat before, during, or after matches, because ping pong’s more fun when you talk a
                  little smack.
                </p>
              </div>
            </div>
          </div>
          <div className="relative w-full flex flex-col items-center">
            <img src="/Gradient.png" className="absolute top-0 w-3/4" />
            <div className="flex flex-col mt-5 items-center">
              <TbLayoutDashboardFilled className="text-[#B13BFF] w-[55px] h-[55px]" />
              <h1 className="text-white font-semibold text-[74px]">Player Dashboard</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
