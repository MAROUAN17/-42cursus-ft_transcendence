import { FaTableTennisPaddleBall } from "react-icons/fa6";
import { RiSwordLine } from "react-icons/ri";
import { FaAward } from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { MdEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";
import { BsPersonFill } from "react-icons/bs";
import { VscListSelection } from "react-icons/vsc";
import { MdUpdate } from "react-icons/md";
import { BsPersonFillAdd } from "react-icons/bs";
import { BsPersonFillCheck } from "react-icons/bs";
import { CgUnblock } from "react-icons/cg";
import { MdBlock } from "react-icons/md";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import HistoryCard from "./historyCard";
import { useEffect, useState } from "react";
import axios, { type AxiosError, type AxiosResponse } from "axios";
import {
  useParams,
  useNavigate,
  UNSAFE_WithComponentProps,
} from "react-router";
import type { ProfileUserInfo } from "../../types/user";
import type { websocketPacket } from "../../../../backend/src/models/webSocket.model";
import { useWebSocket } from "../chat/websocketContext";
import api from "../../axios";

export default function Profile() {
  const { username } = useParams();
  const [profileStatus, setProfileStatus] = useState<string>();
  const [blockedUser, setblockedUser] = useState<boolean>(false);
  const navigate = useNavigate();
  const [currUser, setCurrUser] = useState<ProfileUserInfo>({
    id: 0,
    username: "",
    email: "",
  });
  const { send, addHandler } = useWebSocket();

  const data = [
    { uv: 12, pv: 55 },
    { uv: 13, pv: 30 },
    { uv: 14, pv: 45 },
    { uv: 15, pv: 50 },
    { uv: 16, pv: 60 },
  ];

  function CustomTooltip({ payload, label, active }: any) {
    if (active) {
      return (
        <div className="bg-white p-3 rounded-md">
          <p>{`Match: ${label}`}</p>
          <p>{`Win rate: ${payload[0].value}%`}</p>
        </div>
      );
    }

    return null;
  }

  function sendFriendReq() {
    const notif: websocketPacket = {
      type: "notification",
      data: {
        id: 0,
        type: "friendReq",
        username: "",
        sender_id: 1,
        recipient_id: 2,
        message: "sent you a friend request",
        createdAt: new Date().toISOString().replace("T", " ").split(".")[0],
      },
    };
    send(JSON.stringify(notif));
  }

  useEffect(() => {
    api
      .get("/profile/" + username, { withCredentials: true })
      .then(function (res: AxiosResponse) {
        if (res.data.message == "User1 Blocked User2") {
          setblockedUser(true);
        }
        setCurrUser(res.data.infos);
        setProfileStatus(res.data.profileType);
      })
      .catch(function (err) {});
  }, []);

  return (
    <div className="flex flex-col bg-darkBg h-full w-full font-poppins">
      <div className="flex p-8 h-[50%] space-x-4">
        {/* stats section */}
        <div className="p-14 bg-compBg/20 w-[85%] rounded-[10px] space-y-12">
          <div className="rounded-lg flex space-x-8 h-[25%]">
            <div className="p-4 bg-neon/[88%] w-[360px] h-[100px] rounded-lg flex items-center space-x-3">
              <div>
                <FaTableTennisPaddleBall color="white" size={35} />
              </div>
              <div>
                <h1 className="text-white font-bold text-4xl">169</h1>
                <p className="text-white font-light text-sm">Matches played</p>
              </div>
            </div>
            <div className="border border-borderColor p-4 w-[360px] h-[100px] rounded-lg flex items-center space-x-3">
              <div>
                <RiSwordLine className="text-gray-500" size={35} />
              </div>
              <div>
                <h1 className="text-white font-bold text-4xl">55%</h1>
                <p className="text-white font-light text-sm">Win ratio %</p>
              </div>
            </div>
            <div className="border border-borderColor p-4 w-[360px] h-[100px] rounded-lg flex items-center space-x-3">
              <div>
                <FaAward className="text-gray-500" size={35} />
              </div>
              <div>
                <h1 className="text-white font-bold text-4xl">13</h1>
                <p className="text-white font-light text-sm">Tournaments Won</p>
              </div>
            </div>
            <div className="border border-borderColor p-4 w-[360px] h-[100px] rounded-lg flex items-center space-x-3">
              <div>
                <MdLeaderboard className="text-gray-500" size={35} />
              </div>
              <div>
                <h1 className="text-white font-bold text-4xl">#16</h1>
                <p className="text-white font-light text-sm">Current Rank</p>
              </div>
            </div>
            <div className="border border-borderColor p-4 w-[360px] h-[100px] rounded-lg flex items-center space-x-3">
              <div>
                <MdLeaderboard className="text-gray-500" size={35} />
              </div>
              <div>
                <h1 className="text-white font-bold text-4xl">20</h1>
                <p className="text-white font-light text-sm">Friends</p>
              </div>
            </div>
          </div>
          <div className="h-[75%]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart width={300} height={100} data={data}>
                <XAxis dataKey="uv" />
                <YAxis />
                <Line
                  type="monotone"
                  dataKey="pv"
                  stroke="#B13BFF"
                  strokeWidth={4}
                />
                <Tooltip content={<CustomTooltip />} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* profile section */}
        <div className="bg-compBg/20 w-[15%] rounded-[10px] p-8 flex flex-col justify-between ">
          <div className="flex justify-between w-full">
            <h1 className="text-white font-bold">Your profile</h1>
            <img src="3dots-icon.png" alt="" />
          </div>
          <div className="text-center flex flex-col items-center space-y-6">
            <div className="w-[100px] h-[100px] mt-4 outline outline-8 outline-neon rounded-full flex items-center justify-center">
              <img
                className="rounded-full"
                src="/photo.png"
                alt=""
                width="90px"
                height="90px"
              />
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold">
                {currUser.username}
              </h1>
            </div>
            <div
              className={`flex ${
                profileStatus == "other" ? "space-x-5" : ""
              } w-[120px] justify-center`}
            >
              {profileStatus == "me" ? (
                <div className="flex justify-center mt-8 outline outline-white outline-2 outline-offset-4 rounded-full w-[25%]">
                  <CiSettings color="white" size={30} />
                </div>
              ) : null}
              {!blockedUser ? (
                <div className="flex justify-center mt-8 outline outline-white outline-2 outline-offset-4 rounded-full w-[25%] items-center">
                  <MdBlock
                    color="white"
                    size={30}
                    onClick={() => {
                      api
                        .post(
                          "/block/" + currUser.id,
                          {},
                          { withCredentials: true }
                        )
                        .then(function (res) {
                          setblockedUser(true);
                        });
                    }}
                  />
                </div>
              ) : (
                <div className="flex justify-center mt-8 outline outline-white outline-2 outline-offset-4 rounded-full w-[25%] items-center">
                  <CgUnblock
                    color="white"
                    size={30}
                    onClick={() => {
                      api
                        .post(
                          "/unblock/" + currUser.id,
                          {},
                          { withCredentials: true }
                        )
                        .then(function (res) {
                          setblockedUser(false);
                        })
                        .catch(function (err) {
                          console.log(err);
                        });
                    }}
                  />
                </div>
              )}
              {profileStatus == "other" && !blockedUser ? (
                <div className="flex justify-center mt-8 outline outline-white outline-2 outline-offset-4 rounded-full w-[25%] items-center">
                  <BsPersonFillAdd
                    onClick={() => {
                      sendFriendReq();
                    }}
                    color="white"
                    size={25}
                  />
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col space-y-6 mx-auto mt-6">
            <div className="flex space-x-6 items-center">
              <div>
                <MdEmail
                  className="text-neon outline outline-3 outline-offset-8 rounded-full"
                  size={25}
                />
              </div>
              <div>
                <h1 className="text-neon font-bold">Email</h1>
                <h1 className="text-white font-bold">{currUser.email}</h1>
              </div>
            </div>
            <div className="flex space-x-6 items-center">
              <div>
                <FaHistory
                  className="text-neon outline outline-3 outline-offset-8 rounded-full"
                  size={25}
                />
              </div>
              <div>
                <h1 className="text-neon font-bold">Created</h1>
                <h1 className="text-white font-bold">2 years ago</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-8 h-[50%]">
        <div className="bg-compBg/20 flex flex-col justify-center rounded-[20px]">
          <div className="px-8 py-6 flex justify-between">
            <h1 className="text-white font-bold">History</h1>
            <h1 className="text-white font-bold">
              <span className="text-neon">1 - 10 </span>of 256
            </h1>
          </div>
          <div>
            <hr className="border-1 border-[#343B4F]" />
          </div>
          {/* fields */}
          <div className="px-12 py-6 text-white font-bold flex justify-between">
            <div className="flex justify-center items-center space-x-2 w-[200px]">
              <BsPersonFill />
              <h1>User</h1>
            </div>
            <div className="flex justify-center items-center space-x-2 w-[200px]">
              <VscListSelection />
              <h1>Match Type</h1>
            </div>
            <div className="flex justify-center items-center space-x-2 w-[200px]">
              <MdLeaderboard />
              <h1>Result</h1>
            </div>
            <div className="flex justify-center items-center space-x-2 w-[200px]">
              <RiSwordLine />
              <h1>Final Score</h1>
            </div>
            <div className="flex justify-center items-center space-x-2 w-[200px]">
              <MdUpdate />
              <h1>Date & Time</h1>
            </div>
          </div>
          {/* values */}
          <HistoryCard />
          <hr className="border-1 border-white/20" />
          <HistoryCard />
          <hr className="border-1 border-white/20" />
          <HistoryCard />
          <hr className="border-1 border-white/20" />
          <HistoryCard />
          <hr className="border-1 border-white/20" />
          <HistoryCard />
        </div>
        <div className="flex justify-between">
          <div>
            <h1 className="text-white">1 - 10 of 460</h1>
          </div>
          <div>
            <h1 className="text-white">Rows per page</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
