import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Infos } from "../user/login";
import { GrFormNextLink } from "react-icons/gr";
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";

export default function Dashboard() {
  const data = [
    { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
    { name: "Page A", uv: 300, pv: 2400, amt: 2400 },
    { name: "Page A", uv: 500, pv: 2400, amt: 2400 },
    { name: "Page A", uv: 900, pv: 2400, amt: 2400 },
    { name: "Page A", uv: 1000, pv: 2400, amt: 2400 },
    { name: "Page A", uv: 900, pv: 2400, amt: 2400 },
    { name: "Page A", uv: 1200, pv: 2400, amt: 2400 },
  ];

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
    axios
      .post("https://localhost:5000/logout", {}, { withCredentials: true })
      .then(function (res) {
        console.log(res);
        navigate("/login");
      })
      .catch(function (err) {
        console.log(err.response);
      });
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
        if (err.response.status == 401 && err.response.data.error == "Unauthorized") navigate("/login");
      });

    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalReq = error.config;

        if (error.response.status == 401 && error.response.data.error == "JWT_EXPIRED") {
          originalReq._retry = false;
          try {
            const res = await axios.post("https://localhost:5000/jwt/new", {}, { withCredentials: true });
            console.log(res);
            return axios(originalReq);
          } catch (error) {
            console.log(error);
            navigate("/login");
          }
        }
        return Promise.reject(error);
      }
    );
  }, []);

  function CustomTooltip({ payload, label, active }: any) {
    if (active) {
      return (
        <div className="bg-white p-3 rounded-md">
          <p>{`Day ${label} : ${payload[0].value} Matchs Played`}</p>
        </div>
      );
    }

    return null;
  }

  return (
    <div className="font-poppins w-full pl-5 flex flex-col ">
      <h1 className="text-white font-bold text-[30px]">
        Hi, <span className="text-neon">{user.username}</span>
      </h1>
      <div className="flex w-full h-2/5 gap-5">
        <div className="bg-compBg flex flex-row basis-3/5  grow rounded-[30px] p-10">
          <div className="flex flex-col gap-1 justify-between ">
            <h2 className="text-white font-bold text-[40px]">Find Your Next Opponent!</h2>
            <p className="text-[#fff]/[50%] text-[20px]">
              Jump into matchmaking and challenge players from around the world. Serve, smash, and score!
            </p>
            <button className="bg-darkBg/10 p-2 shadow-[0_5px_10px_rgba(0,0,0,0.25)] px-8 flex items-center rounded-full gap-2 w-fit">
              <p className="text-white font-medium">Play Now</p>
              <div className=" bg-neon rounded-full">
                <GrFormNextLink className="text-white w-7 h-7" />
              </div>
            </button>
          </div>
          <img src="/src/assets/paddle.png" className="w-[400px] h-[400px]" />
        </div>
        <div className="bg-compBg overflow-hidden relative basis-2/5 grow rounded-[30px]">
          <div className="flex flex-col justify-between p-10 relative gap-6 z-10 w-fit">
            <div className="">
              <h2 className="text-white font-bold text-[60px] h-fit">30</h2>
              <p className="text-white text-[30px] mt-[-15px]">Games Played</p>
            </div>
            <button className="bg-darkBg/10 p-2 shadow-[0_5px_10px_rgba(0,0,0,0.25)]  px-8 flex items-center rounded-full gap-2 w-fit">
              <p className="text-white font-medium">History</p>
              <div className=" bg-neon rounded-full">
                <GrFormNextLink className="text-white w-7 h-7" />
              </div>
            </button>
          </div>
          <div className="absolute inset-0 opacity-40 z-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{
                  top: 10,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}
              >
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
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
