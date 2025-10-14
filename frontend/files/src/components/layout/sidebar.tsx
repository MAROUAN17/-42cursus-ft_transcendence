import { FaUser, FaUserFriends } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { IoGameController } from "react-icons/io5";
import { MdHome, MdLeaderboard } from "react-icons/md";
import { replace, useNavigate } from "react-router";

interface props {
  setSettingsOpen: (param: boolean) => void;
}

const Sidebar = ({ setSettingsOpen }: props) => {
  const navigate = useNavigate();
  return (
    <div className="ml-3 my-auto h-full py-60">
      <div className="flex flex-col pb-8 items-center h-full justify-between bg-compBg w-[80px] rounded-full font-poppins ">
        <img src="/src/assets/tmp_logo.png" className="" />
        <div className="flex flex-col gap-7">
          <MdHome
            onClick={() => navigate("/")}
            className="text-white w-7 h-7 shadow-[0_0px_30px_rgba(0,0,0,0.25)] hover:shadow-neon transform hover:scale-150 hover:bg-neon p-1 transition rounded-full duration-300"
          />
          <FaUser
            onClick={() => navigate("/profile")}
            className="text-white w-7 h-7 shadow-[0_0px_30px_rgba(0,0,0,0.25)] hover:shadow-neon transform hover:scale-150 transition hover:bg-neon p-1 rounded-full duration-300"
          />
          <IoIosMail
            onClick={() => navigate("/chat")}
            className="text-white w-7 h-7 shadow-[0_0px_30px_rgba(0,0,0,0.25)] hover:shadow-neon transform hover:scale-150 transition hover:bg-neon p-1 rounded-full duration-300"
          />
          <FaUserFriends
            onClick={() => navigate("/tournaments")}
            className="text-white w-7 h-7 shadow-[0_0px_30px_rgba(0,0,0,0.25)] hover:shadow-neon transform hover:scale-150 transition hover:bg-neon p-1 rounded-full duration-300"
          />
          <MdLeaderboard
            onClick={() => navigate("/leaderboard")}
            className="text-white w-7 h-7 shadow-[0_0px_30px_rgba(0,0,0,0.25)] hover:shadow-neon transform hover:scale-150 transition hover:bg-neon p-1 rounded-full duration-300"
          />
          <IoGameController
            onClick={() => navigate("/pairing")}
            className="text-white w-7 h-7 shadow-[0_0px_30px_rgba(0,0,0,0.25)] hover:shadow-neon transform hover:scale-150 hover:bg-neon p-1 rounded-full transition duration-300"
          />
        </div>
        <FaGear
          onClick={() => setSettingsOpen(true)}
          className="text-white w-7 h-7 shadow-[0_0px_30px_rgba(0,0,0,0.25)] hover:shadow-neon transform hover:scale-150 hover:bg-neon p-1 rounded-full transition duration-300"
        />
      </div>
    </div>
  );
};

export default Sidebar;
