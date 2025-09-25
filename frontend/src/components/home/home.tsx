import React from "react";
import { AiFillInstagram, AiFillTwitterCircle } from "react-icons/ai";
import { BsFacebook, BsQuestionDiamondFill, BsStars } from "react-icons/bs";
import {
  FaFacebook,
  FaFacebookF,
  FaGithub,
  FaHome,
  FaInfoCircle,
  FaInstagram,
  FaRobot,
  FaTrophy,
  FaTwitter,
  FaUserCircle,
  FaUserFriends,
} from "react-icons/fa";
import { FaArrowRightLong, FaCircleQuestion, FaRankingStar } from "react-icons/fa6";
import { HiLightningBolt } from "react-icons/hi";
import { IoIosChatboxes, IoIosNotifications } from "react-icons/io";
import { IoStatsChart } from "react-icons/io5";
import { LuHistory } from "react-icons/lu";
import { MdLeaderboard } from "react-icons/md";
import { RiFacebookCircleFill, RiSwordFill } from "react-icons/ri";
import { SiFacebook } from "react-icons/si";
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
      <div className="relative w-full min-h-full bg-[#14121C] flex flex-col items-center ">
        <img src="/home-bg3.png" className=" object-cover" />
        <img src="/home-bg3.png" className="mt-[-550px] object-cover" />
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
            <img src="/Gradient.png" className="absolute top-[-100px] w-3/4" />
            <div className="flex flex-col mt-5 items-center">
              <TbLayoutDashboardFilled className="text-[#B13BFF] w-[55px] h-[55px]" />
              <h1 className="text-white font-semibold text-[74px]">Player Dashboard</h1>
              <img
                src="/dashboard.png"
                className="w-2/3 opacity-60 rounded-[20px] [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]"
              />
              <h2 className="text-[#F7F8F8]/80 font-semibold text-[40px] w-2/5 text-center">
                Keep track of your progress in one place. <br /> View your match history, rankings, stats, and customize your player profile with
                ease.
              </h2>
              <hr className="w-1/3 h-[5px] mt-8 border-none bg-gradient-to-r from-[#000000]/0 via-[#FFFFFF]/10 to-[#000000]/0" />
              <div className="flex flex-wrap mt-10 justify-between gap-6 w-2/5">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex text-white items-center gap-1">
                    <LuHistory />
                    <h4 className="font-medium">Match History</h4>
                  </div>
                  <p className="text-[16px] text-[#B4BCD0] w-[250px] text-center">Review your recent games and scores at a glance.</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex text-white items-center gap-1">
                    <IoStatsChart />
                    <h4 className="font-medium">Stats & Analytics</h4>
                  </div>
                  <p className="text-[16px] text-[#B4BCD0] w-[250px] text-center">Track your performance with detailed stats.</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex text-white items-center gap-1">
                    <MdLeaderboard />
                    <h4 className="font-medium">Ranking & Leaderboard</h4>
                  </div>
                  <p className="text-[16px] text-[#B4BCD0] w-[250px] text-center">See your current rank and climb progress.</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex text-white items-center gap-1">
                    <FaUserCircle />
                    <h4 className="font-medium">Profile Settings</h4>
                  </div>
                  <p className="text-[16px] text-[#B4BCD0] w-[250px] text-center">Edit your name, avatar, and player info.</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex text-white items-center gap-1">
                    <IoIosNotifications />
                    <h4 className="font-medium">Notifications & Messages</h4>
                  </div>
                  <p className="text-[16px] text-[#B4BCD0] w-[250px] text-center">Get updates, invites, and system alerts.</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex text-white items-center gap-1">
                    <FaUserFriends />
                    <h4 className="font-medium">Friends & Opponents</h4>
                  </div>
                  <p className="text-[16px] text-[#B4BCD0] w-[250px] text-center">View your friends list and recent matches.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-16 gap-2 w-full items-center">
          <BsQuestionDiamondFill className="text-[#B13BFF] w-[55px] h-[55px]" />
          <h1 className="text-white font-semibold text-[54px]">Frequently Asked Questions</h1>
          <p className="text-[#94969E] text-[20px]">
            We've got answers. Here are some quick Frequently Asked Questions to help you get started and make the most of your ping pong experience.
          </p>
          <div className="flex flex-wrap w-full gap-36 items-center justify-center my-10">
            <div className="relative w-[500px]">
              <div className="absolute top-0 gap-5 z-10 flex flex-col items-center w-full h-full justify-center">
                <h1 className="text-white text-[30px] font-bold">Is the game free to play?</h1>
                <p className="text-[25px] text-center text-[#94969E] font-medium px-16">
                  Yes! You can play 1v1 matches, tournaments, and vs AI, all for free.
                </p>
              </div>
              <img src="/Card.png" className="w-full opacity-80 border object-cover border-neon/20 rounded-[20px]" />
            </div>
            <div className="relative w-[500px]">
              <div className="absolute top-0 gap-5 z-10 flex flex-col items-center w-full h-full justify-center">
                <h1 className="text-white text-[30px] font-bold">Can I play with friends?</h1>
                <p className="text-[25px] text-center text-[#94969E] font-medium px-16">
                  Yes! You can invite friends to private matches or team up in custom lobbies.
                </p>
              </div>
              <img src="/Card.png" className="w-full opacity-80 border object-cover border-neon/20 rounded-[20px]" />
            </div>
            <div className="relative w-[500px]">
              <div className="absolute top-0 gap-5 z-10 flex flex-col items-center w-full h-full justify-center">
                <h1 className="text-white text-[30px] font-bold">Is there matchmaking?</h1>
                <p className="text-[25px] text-center text-[#94969E] font-medium px-16">
                  Definitely. Our skill-based matchmaking pairs you with players of a similar level.
                </p>
              </div>
              <img src="/Card.png" className="w-full opacity-80 border object-cover border-neon/20 rounded-[20px]" />
            </div>
          </div>
        </div>
        <div className="w-full h-full relative overflow-hidden flex flex-col">
          <div className="absolute w-full flex-col h-full top-0 flex justify-around items-center">
            <div className="w-full h-4/5 flex justify-around items-center">
              <div className="flex flex-col gap-5 w-1/5">
                <h1 className="text-white font-bold text-[40px] w-fit ">Logo</h1>
                <p className="text-[#A1A1AA] text-[20px] ">
                  Jump into fast-paced 1v1 matches, compete in tournaments, or train against smart AI, right from your browser. No downloads, just
                  pure table ping pong action.
                </p>
                <div className="flex gap-2">
                  <FaTwitter className="bg-[#191D23]/50 p-2 text-white rounded-full text-[30px]" />
                  <FaFacebookF className="bg-[#191D23]/50 p-2 text-white rounded-full text-[30px]" />
                  <FaInstagram className="bg-[#191D23]/50 p-1 text-white rounded-full text-[30px]" />
                  <FaGithub className="bg-[#191D23]/50 p-2 text-white rounded-full text-[30px]" />
                </div>
              </div>
              <div className="flex flex-col gap-5 w-fit">
                <h3 className="font-semibold text-[#A1A1AA] text-[20px] tracking-[3px]">SECTIONS</h3>
                <div className="flex flex-col gap-5">
                  <a href="#" className="font-normal text-white text-[20px] w-fit">
                    About
                  </a>
                  <a href="#" className="font-normal text-white text-[20px] w-fit">
                    Features
                  </a>
                  <a href="#" className="font-normal text-white text-[20px] w-fit">
                    Dashboard
                  </a>
                  <a href="#" className="font-normal text-white text-[20px] w-fit">
                    F.A.Q
                  </a>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <h3 className="font-semibold text-[#A1A1AA] text-[20px] tracking-[3px]">LINKS</h3>
                <div className="flex flex-col gap-5 w-fit">
                  <a href="#" className="font-normal text-white text-[20px] w-fit">
                    Home
                  </a>
                  <a href="#" className="font-normal text-white text-[20px] w-fit">
                    Log in
                  </a>
                  <a href="#" className="font-normal text-white text-[20px] w-fit">
                    Sign up
                  </a>
                  <a href="#" className="font-normal text-white text-[20px] w-fit">
                    Reset Password
                  </a>
                </div>
              </div>
              <div className="flex flex-col gap-5 w-1/5">
                <h3 className="font-semibold text-[#A1A1AA] text-[20px] tracking-[3px]">SUBSCRIBE TO OUR NEWSLETTER</h3>
                <div className="flex flex-col gap-5">
                  <input type="text" placeholder="Enter your email" className="rounded-[5px] px-5 py-4" />
                  <button
                    type="button"
                    className="text-white bg-neon bg-gradient-to-r from-[#B13BFF] text-[30px] to-[#8528FB]/90 shadow-lg shadow-[#B13BFF]/50 font-semibold rounded-[20px] px-12 py-2.5 w-fit text-center"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
            <hr className="w-full h-[5px] border-none bg-gradient-to-r from-[#000000]/0 via-[#FFFFFF]/10 to-[#000000]/0" />
            <p className="text-white flex w-full h-1/6 justify-center items-center">© Copyright 2025, All Rights Reserved by 1337</p>
          </div>
          <img src="/footer.png" className="object-cover w-full h-[500px]" />
        </div>
      </div>
    </div>
  );
};

export default Home;
