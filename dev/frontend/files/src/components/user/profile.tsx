import { FaTableTennisPaddleBall } from "react-icons/fa6";
import { RiSwordLine } from "react-icons/ri";
import { FaArrowLeft, FaArrowRight, FaAward } from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { MdEmail } from "react-icons/md";
import { FaHistory } from "react-icons/fa";
import { BsPersonFill } from "react-icons/bs";
import { VscListSelection } from "react-icons/vsc";
import { MdUpdate } from "react-icons/md";
import { BsPersonFillAdd } from "react-icons/bs";
import { CgUnblock } from "react-icons/cg";
import { MdBlock } from "react-icons/md";
import { FiMessageCircle } from "react-icons/fi";
import { MdOutlinePersonRemove } from "react-icons/md";
import { FaHourglassHalf } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import HistoryCard from "./historyCard";
import { useEffect, useState, useRef } from "react";
import { type AxiosResponse } from "axios";
import { useParams, useNavigate } from "react-router";
import { useWebSocket } from "../contexts/websocketContext";
import api from "../../axios";
import { ToastContainer, toast } from "react-toastify";
import { useUserContext } from "../contexts/userContext";
import type { ChartData, MatchHistory, UserHistory, UserStats } from "../../types/profile";
import type { websocketPacket } from "../../types/websocket";
import Setup2FA from "../user/setup2FA";
import type { UserInfos } from "../../types/user";

export default function Profile() {
  const navigate = useNavigate();
  const { username } = useParams();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [currPage, setCurrPage] = useState<number>(1);
  const [history, setHistory] = useState<UserHistory | undefined>(undefined);
  const [userStats, setUserStats] = useState<UserStats | undefined>(undefined);
  const [settingsPopup, setSettingsPopup] = useState<boolean>(true);
  const [profileStatus, setProfileStatus] = useState<string>();
  const [blockedUser, setblockedUser] = useState<boolean>(false);
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [friendReqSent, setFriendReqSent] = useState<boolean>(false);
  const [currEmail, setCurrEmail] = useState<string | undefined>("");
  const [currUsername, setCurrUsername] = useState<string | undefined>("");
  const [currAvatar, setCurrAvatar] = useState<string>("");
  const [usernameErrorFlag, setUsernameErrorFlag] = useState<boolean>(false);
  const [usernameErrorMssg, setUsernameErrorMssg] = useState<string>("");
  const [emailErrorFlag, setEmailErrorFlag] = useState<boolean>(false);
  const [emailErrorMssg, setEmailErrorMssg] = useState<string>("");
  const pictureInput = useRef<HTMLInputElement>(null);
  const [twoFAVerified, setTwoFAVerified] = useState<boolean>(false);

  const { user } = useUserContext();
  const [currUser, setCurrUser] = useState<UserInfos>({
    id: 0,
    avatar: "",
    username: "",
    email: "",
    first_login: false,
    intra_id: 0,
    online: false,
    twoFA_verify: false,
  });
  const { send, addHandler } = useWebSocket();
  const [data, setData] = useState<ChartData[]>([]);
  const twoFACheckRef = useRef<HTMLInputElement>(null);
  const [setup2FA, setSetup2FA] = useState<boolean>(false);

  function getWeekHistory(historyData: MatchHistory[]) {
    const tmpData: ChartData[] = [
      { uv: 0, pv: 0 },
      { uv: 0, pv: 0 },
      { uv: 0, pv: 0 },
      { uv: 0, pv: 0 },
      { uv: 0, pv: 0 },
    ];
    for (let index = 0; index < historyData.length && index < 5; index++) {
      tmpData[4 - index] = {
        pv: Number(
          ((historyData.slice(index).filter((match) => match.winner == currUser.id).length / historyData.slice(index).length) * 100).toFixed(1)
        ),
        uv: historyData.slice(index).length,
      };
      console.log(
        "match -> ",
        historyData.slice(index).length,
        " count -> ",
        (historyData.slice(index).filter((match) => match.winner == currUser.id).length / historyData.slice(index).length) * 100
      );
    }
    setData(tmpData);
    // historyData.map((match, index) => {

    // });
  }
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
        avatar: "",
        username: "",
        sender_id: user!.id,
        recipient_id: currUser.id,
        message: "Sent you a friend request",
        createdAt: new Date().toISOString().replace("T", " ").split(".")[0],
      },
    };
    send(JSON.stringify(notif));
    setFriendReqSent(true);
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setCurrEmail(e.target.value);
  }

  function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setCurrUsername(e.target.value);
    setUsernameErrorFlag(false);
    setUsernameErrorMssg("");
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    const formData = new FormData();

    setCurrAvatar(e.target.value);
    // formData.append("username", currUsername);
    // formData.append("email", currEmail);
    formData.append("avatar", pictureInput.current!.files![0]);

    api.post("/upload", formData, { withCredentials: true }).then(function (res) {
      setCurrAvatar(res.data.file);
    });
  }

  function editProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    api
      .post(
        "/edit-user",
        {
          id: currUser.id,
          username: currUsername,
          email: currEmail,
        },
        { withCredentials: true }
      )
      .then(function () {
        setSettingsPopup(false);
        toast("Your data changed successfully", {
          closeButton: false,
          className: "font-poppins border-3 border-neon bg-neon/70 text-white font-bold text-md",
        });
        if (!twoFAVerified) setSetup2FA(twoFACheckRef.current!.checked);
        else if (twoFAVerified && !twoFACheckRef.current!.checked) {
          api("/2fa/delete", { withCredentials: true });
        }
        fetchUserData();
      })
      .catch(function (err) {
        if (err.response.data.error.includes("Username")) {
          setUsernameErrorFlag(true);
          setUsernameErrorMssg(err.response.data.error);
        }
        if (err.response.data.error.includes("Email")) {
          setEmailErrorFlag(true);
          setEmailErrorMssg(err.response.data.error);
        }
      });
  }
  useEffect(() => {
    if (!hasAnimated) {
      setTimeout(() => {
        setHasAnimated(true);
      }, 2000);
    }
  }, []);

  useEffect(() => {
    api.get("/states/player-rooms/" + currUser.id, { withCredentials: true }).then(function (res: AxiosResponse) {
      setHistory(res.data);
      const tmp = [...res.data.rooms];
      getWeekHistory(tmp);
    });
    api.get("/states/profile/" + currUser.id, { withCredentials: true }).then(function (res: AxiosResponse) {
      setUserStats(res.data);
    });
  }, [currUser]);

  function fetchUserData() {
    api
      .get("/profile/" + username, { withCredentials: true })
      .then(function (res: AxiosResponse) {
        if (res.data.message == "User1 Blocked User2") {
          setblockedUser(true);
        }
        setCurrUser(res.data.infos);
        setProfileStatus(res.data.profileType);
        setIsFriend(res.data.friend);
        setFriendReqSent(res.data.friendNotif);
        setCurrEmail(res.data.infos.email);
        setCurrUsername(res.data.infos.username);
        setCurrAvatar(res.data.infos.avatar);
        setTwoFAVerified(res.data.twoFAVerify);
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  useEffect(() => {
    fetchUserData();

    return () => {
      setSettingsPopup(false);
    };
  }, [twoFAVerified]);

  async function downloadData(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    try {
      const res = await api.get("/getPersonalData", { withCredentials: true, responseType: "blob" });
      const blob = new Blob([res.data], { type: "applcation/json" }); // create blob object // blob = Binary Large Object
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      console.log("here");
      a.href = url;
      a.download = "userdata.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download Failed: ", error);
    }
  }

  return (
    <div className="flex flex-col bg-darkBg h-full w-full font-poppins">
      {setup2FA ? <Setup2FA id={user?.id} email={user?.email} setSetup2fa={setSetup2FA} setTwoFAverified={setTwoFAVerified} /> : null}
      {settingsPopup ? (
        <div className="absolute z-10 inset-x-[850px] inset-y-[160px] rounded-lg bg-darkBg">
          <div className="justify-end w-full h-full p-6">
            <div className="h-[50px] items-center w-full flex justify-end">
              <IoMdClose
                onClick={() => {
                  console.log("2fa verified -> ", twoFAVerified);
                  setSettingsPopup(false);
                  setUsernameErrorFlag(false);
                  setUsernameErrorMssg("");
                  setCurrEmail(currUser?.email);
                  setCurrUsername(currUser?.username);
                }}
                color="white"
                className="w-[30px] h-[30px] hover:scale-110"
              />
            </div>
            <div className="">
              <h1 className="text-white font-bold text-5xl text-center">Edit Profile</h1>
            </div>
            <form onSubmit={editProfile}>
              <div className="flex flex-col items-center mt-12 space-y-6">
                <div className="w-[150px] h-[150px] mt-4 outline outline-8 outline-neon rounded-full flex items-center justify-center">
                  <label htmlFor="customFile">
                    <img className="rounded-full w-[150px] h-[150px] object-cover" src={currAvatar} alt="avatar" />
                  </label>
                </div>
                <div className="absolute left-[480px] top-[170px] flex items-center justify-center flex-col space-y-3 rounded-full">
                  <input id="customFile" className="hidden text-white" ref={pictureInput} onChange={handleImageUpload} type="file" />
                </div>
                <div className="flex flex-col space-y-3 w-[505px]">
                  {usernameErrorFlag ? (
                    <div>
                      <h1 className="text-red-700 font-bold">{usernameErrorMssg}</h1>
                    </div>
                  ) : null}
                  <label htmlFor="" className="text-white font-bold">
                    Username
                  </label>
                  <input
                    value={currUsername}
                    onChange={handleUsernameChange}
                    type="text"
                    className={`bg-transparent px-12 py-4 rounded-lg text-white ${
                      usernameErrorFlag ? "border-b border-red-700" : "border border-white"
                    }`}
                  />
                </div>
                <div className="flex flex-col space-y-3 w-[505px]">
                  <label htmlFor="" className="text-white font-bold">
                    Email
                  </label>
                  <input
                    value={currEmail}
                    onChange={handleEmailChange}
                    type="email"
                    className="bg-transparent px-12 py-4 rounded-lg border border-white text-white"
                  />
                </div>
                <div className="bg-neon/50 px-6 py-5 rounded-lg w-[505px] flex justify-between items-center">
                  <div className="flex flex-col">
                    <label htmlFor="" className="text-white font-bold">
                      Multi-factor authentication
                    </label>
                    <label htmlFor="" className="text-white text-sm font-light">
                      Enable 2FA to add an extra layer of security to your account
                    </label>
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 appearance-none border-2 border rounded-full checked:bg-gray-300 transition ease-in-out"
                    ref={twoFACheckRef}
                    defaultChecked={twoFAVerified}
                  />
                </div>
                <div className="py-12 flex flex-col gap-3">
                  <button
                    type="submit"
                    className="w-[505px] bg-neon py-3 px-36 text-white rounded-lg font-bold hover:scale-[1.05] transition duration-500"
                  >
                    Save changes
                  </button>
                  <button
                    onClick={downloadData}
                    className="bg-blue-500 py-3 px-36 text-white rounded-lg font-bold hover:scale-[1.05] transition duration-500"
                  >
                    Download Personal Data
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      api.delete("/deleteAccount", { withCredentials: true }).then(() => {
                        api
                          .post("/logout", {}, { withCredentials: true })
                          .then(function (res) {
                            console.log(res);
                            navigate("/login");
                          })
                          .catch(function (err) {
                            console.log(err.response);
                          });
                      });
                    }}
                    className="bg-red-600 py-3 px-36 text-white rounded-lg font-bold hover:scale-[1.05] transition duration-500"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}
      <div className={`flex p-8 h-[50%] space-x-4 ${settingsPopup || setup2FA ? "blur-sm pointer-events-none" : ""}`}>
        <ToastContainer closeOnClick={true} className="bg-green text-green-600" />
        {/* stats section */}
        <div className="py-14 bg-compBg/20 w-[85%] rounded-[10px] space-y-12">
          <div className="rounded-lg px-14 flex space-x-8 h-[25%]">
            <div className="p-4 bg-neon/[88%] w-[360px] h-[100px] rounded-lg flex items-center space-x-3">
              <div>
                <FaTableTennisPaddleBall color="white" size={35} />
              </div>
              <div>
                <h1 className="text-white font-bold text-4xl">{userStats?.matchesPlayed}</h1>
                <p className="text-white font-light text-sm">Matches played</p>
              </div>
            </div>
            <div className="border border-borderColor p-4 w-[360px] h-[100px] rounded-lg flex items-center space-x-3">
              <div>
                <RiSwordLine className="text-gray-500" size={35} />
              </div>
              <div>
                <h1 className="text-white font-bold text-4xl">{userStats && (userStats.winRatio * 100).toFixed(2)}%</h1>
                <p className="text-white font-light text-sm">Win ratio %</p>
              </div>
            </div>
            <div className="border border-borderColor p-4 w-[360px] h-[100px] rounded-lg flex items-center space-x-3">
              <div>
                <FaAward className="text-gray-500" size={35} />
              </div>
              <div>
                <h1 className="text-white font-bold text-4xl">{userStats?.tournamentsWon}</h1>
                <p className="text-white font-light text-sm">Tournaments Won</p>
              </div>
            </div>
            <div className="border border-borderColor p-4 w-[360px] h-[100px] rounded-lg flex items-center space-x-3">
              <div>
                <MdLeaderboard className="text-gray-500" size={35} />
              </div>
              <div>
                <h1 className="text-white font-bold text-4xl">#{userStats?.rank}</h1>
                <p className="text-white font-light text-sm">Current Rank</p>
              </div>
            </div>
            <div className="border border-borderColor p-4 w-[360px] h-[100px] rounded-lg flex items-center space-x-3">
              <div>
                <MdLeaderboard className="text-gray-500" size={35} />
              </div>
              <div>
                <h1 className="text-white font-bold text-4xl">{userStats?.friendsCount}</h1>
                <p className="text-white font-light text-sm">Friends</p>
              </div>
            </div>
          </div>
          <div className="pr-14 w-full h-[75%]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart width={300} height={100} data={data}>
                <XAxis dataKey="uv" />
                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <Line type="monotone" isAnimationActive={!hasAnimated} dataKey="pv" stroke="#B13BFF" strokeWidth={4} />
                <Tooltip content={<CustomTooltip />} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* profile section */}
        <div className="bg-compBg/20 w-[30%] rounded-[10px] py-10 flex flex-col justify-around items-center">
          <div className="text-center flex flex-col justify-center items-center space-y-9">
            <div className="w-[100px] h-[100px] mt-4 outline outline-8 outline-neon rounded-full flex items-center justify-center">
              <img className="rounded-full w-[90px] h-[90px] object-cover" src={currAvatar} alt="" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold">{currUser.username}</h1>
            </div>
            <div>
              {profileStatus == "me" ? (
                <div className="flex w-[120px] justify-center">
                  <div className="flex justify-center mt-2 outline outline-white outline-2 outline-offset-4 rounded-full w-[25%]">
                    <CiSettings
                      onClick={() => {
                        setSettingsPopup(true);
                      }}
                      className="hover:scale-110"
                      color="white"
                      size={30}
                    />
                  </div>
                </div>
              ) : !blockedUser ? (
                <div className="flex space-x-5 w-[130px] justify-center">
                  <div className="flex justify-center mt-2 outline outline-white outline-2 outline-offset-4 rounded-full w-[25%] items-center">
                    <MdBlock
                      className="hover:scale-110"
                      color="white"
                      size={30}
                      onClick={() => {
                        api.post("/block/" + currUser.id, {}, { withCredentials: true }).then(function () {
                          setblockedUser(true);
                          setIsFriend(false);
                        });
                      }}
                    />
                  </div>
                  {isFriend ? (
                    <>
                      <div className=" flex justify-center mt-2 outline outline-white outline-2 outline-offset-4 rounded-full w-[25%] items-center">
                        <FiMessageCircle
                          className="hover:scale-110"
                          onClick={() => {
                            navigate("/chat/" + currUser.username);
                          }}
                          color="white"
                          size={25}
                        />
                      </div>
                      <div className="flex justify-center mt-2 outline outline-white outline-2 outline-offset-4 rounded-full w-[25%] items-center">
                        <MdOutlinePersonRemove
                          className="hover:scale-110"
                          onClick={() => {
                            api.post("/unfriend/" + currUser.id, {}, { withCredentials: true }).then(function () {
                              setIsFriend(false);
                            });
                          }}
                          color="white"
                          size={25}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {friendReqSent ? (
                        <div className="flex justify-center mt-2 outline outline-white outline-2 outline-offset-4 rounded-full w-[25%] items-center">
                          <FaHourglassHalf className="hover:scale-110" color="white" size={20} />
                        </div>
                      ) : (
                        <div className="flex justify-center mt-2 outline outline-white outline-2 outline-offset-4 rounded-full w-[25%] items-center">
                          <BsPersonFillAdd
                            className="hover:scale-110"
                            onClick={() => {
                              sendFriendReq();
                            }}
                            color="white"
                            size={25}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="flex w-[120px] justify-center">
                  <div className="flex justify-center mt-2 outline outline-white outline-2 outline-offset-4 rounded-full w-[25%] items-center">
                    <CgUnblock
                      className="hover:scale-110"
                      color="white"
                      size={30}
                      onClick={() => {
                        api
                          .post("/unblock/" + currUser.id, {}, { withCredentials: true })
                          .then(function (res) {
                            setblockedUser(false);
                          })
                          .catch(function (err) {
                            console.log(err);
                          });
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-5 justify-center">
            <div className="flex space-x-5 items-center">
              <div>
                <MdEmail className="text-neon outline outline-3 outline-offset-8 rounded-full" size={25} />
              </div>
              <div>
                <h1 className="text-neon font-bold">Email</h1>
                <h1 className="text-white font-bold">{currUser.email}</h1>
              </div>
            </div>
            <div className="flex space-x-5 items-center">
              <div>
                <FaHistory className="text-neon outline outline-3 outline-offset-8 rounded-full" size={25} />
              </div>
              <div>
                <h1 className="text-neon font-bold">Created</h1>
                <h1 className="text-white font-bold">2 years ago</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`px-8 h-[50%] ${settingsPopup || setup2FA ? "blur-sm pointer-events-none" : ""}`}>
        <div className="bg-compBg/20 overflow-hidden flex flex-col justify-center rounded-[20px]">
          <div className="px-8 py-6 flex justify-between">
            <h1 className="text-white font-bold">History</h1>
            <h1 className="text-white font-bold">
              <span className="text-neon">
                {currPage * 5 - 4} -{" "}
                {history && (currPage * 5 > history.rooms.length ? (!history.rooms.length ? 1 : history.rooms.length) : currPage * 5)}{" "}
              </span>
              of {history?.rooms.length == 0 ? 1 : history?.rooms.length}
            </h1>
          </div>
          <div>
            <hr className="border-1 border-[#343B4F]" />
          </div>
          {/* fields */}
          <div className="px-12 py-5 text-white font-bold flex justify-between">
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
          <ul>
            {history?.rooms.length ? (
              history.rooms
                .slice(currPage * 5 - 5, currPage * 5 > history.rooms.length ? history.rooms.length : currPage * 5)
                .map((match: MatchHistory, index, arr) =>
                  user ? (
                    <li key={match.id}>
                      <HistoryCard match={match} userId={currUser.id} />
                      {index + 1 < arr.length ? <hr className="border-1 border-white/20" /> : null}
                    </li>
                  ) : null
                )
            ) : (
              <li className="bg-compBg/20 p-7 text-white flex flex-col justify-center items-center">
                <img className="h-[300px] opacity-90" src="/no_history.png" />
                {user?.id == currUser.id ? (
                  <>
                    <h1 className="font-bold text-[30px]">No Matches Found</h1>
                    <p className="font-normal text-[20px]">Play your first game to start building your history.</p>
                  </>
                ) : (
                  <>
                    <h1 className="font-bold text-[30px]">No Matches Found</h1>
                    <p className="font-normal text-[20px]">This player hasn't played any games yet.</p>
                  </>
                )}
              </li>
            )}
          </ul>
        </div>
        <div className="flex mt-3 justify-between">
          <div>
            <h1 className="text-white">
              Page <span className="text-neon">{currPage}</span> of {history && (history.rooms.length == 0 ? 1 : Math.ceil(history.rooms.length / 5))}
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                currPage > 1 ? setCurrPage(currPage - 1) : null;
              }}
              className="bg-compBg/20 h-[40px] w-[40px] flex justify-center items-center rounded-lg"
            >
              <FaArrowLeft className={`${currPage > 1 ? "text-white" : "text-white/50"}`} />
            </button>
            <button className="bg-compBg/20 h-[40px] w-[40px] flex justify-center items-center rounded-lg">
              <FaArrowRight
                onClick={() => {
                  history ? (currPage < history.rooms.length / 5 ? setCurrPage(currPage + 1) : null) : null;
                }}
                className={`${history ? (currPage < history.rooms.length / 5 ? "text-white" : "text-white/50") : "text-white/50"}`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
