import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Infos } from "../user/login";
import { GrFormNextLink } from "react-icons/gr";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<Infos>({ username: "", email: "" });
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    axios
      .get("https://localhost:5000/", { withCredentials: true })
      .then(function (res) {
        console.log(res.data.data);
        console.log("Authorized!!");
      })
      .catch(function (err) {
        navigate("/login");
      });
  }

    function handleLogout(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        axios.post('https://localhost:5000/logout', {}, { withCredentials: true })
            .then(function(res) {
                console.log(res);
                navigate("/login");
            })
            .catch(function(err) {
                console.log(err.response);
            })
    }

  useEffect(() => {
    axios
      .get("https://localhost:5000/user", { withCredentials: true })
      .then(function (res) {
        console.log(res.data.infos);
        setUser(res.data.infos);
      })
      .catch(function (err) {
        console.log(err.response.data);
        navigate("/login");
      });
  }, []);

  return (
    <div className="font-poppins pl-5 flex flex-col ">
      <h1 className="text-white font-bold text-[30px]">
        Hi, <span className="text-neon">{user.username}</span>
      </h1>
      <div className="flex w-full gap-5">
        <div className="bg-compBg flex flex-row w-auto basis-3/5 rounded-[30px]">
          <div className="flex flex-col gap-5 p-10">
            <h2 className="text-white font-bold text-[30px]">Find Your Next Opponent!</h2>
            <p className="text-[#fff]/[50%]">
              Jump into matchmaking and challenge players from around the world. Serve, smash, and score!
            </p>
            <button className="bg-darkBg/10 p-2 shadow-[0_5px_10px_rgba(0,0,0,0.25)] px-8 flex items-center rounded-full gap-2 w-fit">
              <p className="text-white font-medium">Play Now</p>
              <div className=" bg-neon rounded-full">
                <GrFormNextLink className="text-white w-7 h-7" />
              </div>
            </button>
          </div>
          <img src="/src/assets/paddle.png" className="w-[300px] h-[300px]" />
        </div>
        <div className="bg-compBg flex flex-row w-auto basis-2/5 rounded-[30px]">
          <div className="flex flex-col justify-between p-10">
            <div className="">
              <h2 className="text-white font-bold text-[60px] h-fit">30</h2>
              <p className="text-white text-[30px]">Games Played</p>
            </div>
            <button className="bg-darkBg/10 p-2 shadow-[0_5px_10px_rgba(0,0,0,0.25)]  px-8 flex items-center rounded-full gap-2 w-fit">
              <p className="text-white font-medium">Play Now</p>
              <div className=" bg-neon rounded-full">
                <GrFormNextLink className="text-white w-7 h-7" />
              </div>
            </button>
          </div>
        </div>
      </div>
      {/* <button className="px-12 py-4 bg-neon text-white" onClick={handleClick}>
        click
      </button>
      <button className="px-12 py-4 bg-neon text-white" onClick={handleLogout}>
        logout
      </button> */}
    </div>
  );
}
