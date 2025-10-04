import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { GrFormNextLink } from "react-icons/gr";
import TournamentCard from "./tournamentCard";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import LeadersCard from "./leadersCard";
import { MdGroups } from "react-icons/md";
import FriendBubble from "./friendBubble";
import { IoChatbubblesSharp } from "react-icons/io5";
import MessageBubble from "./messageBubble";
import { useWebSocket } from "../contexts/websocketContext";
import api from "../../axios";
import type {
  messagePacket,
  UsersLastMessage,
} from "../../../../backend/src/models/chat";
import type { websocketPacket } from "../../../../backend/src/models/webSocket.model";
import { useUserContext } from "../contexts/userContext";
import LogCard from "./logCard";
import type { Tournament } from "../../types/tournament";
import type { Leader } from "../../types/leader";

export default function Dashboard() {
  const data = useRef([
    { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
    { name: "Page A", uv: 300, pv: 2400, amt: 2400 },
    { name: "Page A", uv: 500, pv: 2400, amt: 2400 },
    { name: "Page A", uv: 900, pv: 2400, amt: 2400 },
    { name: "Page A", uv: 1000, pv: 2400, amt: 2400 },
    { name: "Page A", uv: 900, pv: 2400, amt: 2400 },
    { name: "Page A", uv: 1200, pv: 2400, amt: 2400 },
  ]).current;
  const { addHandler } = useWebSocket();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [show, setShow] = useState<boolean>(false);
  const [friendOpt, setFriendOpt] = useState<number>(0);
  const [gamesPlayed, setGamesPlayed] = useState<number>(0);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [friends, setFriends] = useState<UsersLastMessage[]>([]);
  const friendsRef = useRef(friends);
  const friendOptRef = useRef<HTMLDivElement>(null);
  const [friendsMessages, setFriendsMessages] = useState<UsersLastMessage[]>(
    []
  );
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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        friendOptRef.current &&
        !friendOptRef.current.contains(e.target as Node)
      )
        setFriendOpt(0);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleOnlineNotif(packet: websocketPacket) {
    console.log("got packet -> ", packet);
    if (packet.type != "onlineStatus") return;
    if (packet.data.type == "singleFriend") {
      setFriends((prev: UsersLastMessage[]) => {
        return prev.map((user) => {
          return user.user.id == packet.data.friend_id
            ? { ...user, user: { ...user.user, online: packet.data.online } }
            : user;
        });
      });
    } else if (packet.data.type == "friendsList") {
      if (!packet.data.friends_list) return;
      for (const friendId of packet.data.friends_list) {
        const index = friendsRef.current.findIndex(
          (u) => u.user.id === friendId
        );
        if (index == -1) continue;
        const updatedUser: UsersLastMessage = {
          ...friendsRef.current[index],
          user: { ...friendsRef.current[index].user, online: true },
        };
        // const copy = [...friendsRef.current];
        friendsRef.current.splice(index, 1);
        friendsRef.current.unshift(updatedUser);
      }
      setFriends(friendsRef.current);
      // setFriendsMessages(
      //   friendsRef.current.sort(function (a: UsersLastMessage, b: UsersLastMessage) {
      //     const x: string = a.lastMessage ? a.lastMessage.createdAt : "";
      //     const y: string = b.lastMessage ? b.lastMessage.createdAt : "";
      //     if (x > y) return -1;
      //     return 1;
      //   })
      // );
    }
  }
  useEffect(() => {
    const addedHandled = addHandler("chat", handleChat);
    return addedHandled;
  }, []);
  // console.log("showFriends -> ", showFriends);
  // console.log("friends -> ", friends);

  function handleChat(packet: websocketPacket) {
    if (packet.type != "chat") return;
    const newMsg: messagePacket = packet.data;
    if (newMsg.type === "message") {
      setFriendsMessages((prev: UsersLastMessage[]) => {
        const index = prev.findIndex((u) => u.user.id === newMsg.sender_id);
        if (index == -1) return prev;
        const updatedUser: UsersLastMessage = {
          ...prev[index],
          lastMessage: newMsg,
          unreadCount: prev[index].unreadCount + 1,
        };
        const copy = [...prev];
        copy.splice(index, 1);
        copy.unshift(updatedUser);
        return copy;
      });
    }
  }
  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 50);

    api
      .get("/users", { withCredentials: true })
      .then(function (res) {
        setFriendsMessages(
          res.data.data.sort(function (
            a: UsersLastMessage,
            b: UsersLastMessage
          ) {
            const x: string = a.lastMessage ? a.lastMessage.createdAt : "";
            const y: string = b.lastMessage ? b.lastMessage.createdAt : "";
            if (x > y) return -1;
            return 1;
          })
        );
        friendsRef.current = [...res.data.data];
        setFriends(
          res.data.data.sort((a: UsersLastMessage, b: UsersLastMessage) => {
            return (
              (b.user.online == true ? 1 : 0) - (a.user.online == true ? 1 : 0)
            );
          })
        );
      })
      .catch(function (err) {
        console.log(err);
      });

    api("/tournament/all", { withCredentials: true }).then(function (res) {
      setTournaments(res.data);
      tournaments?.sort((a, b) => b.players.length - a.players.length);
    });

    api("/states/leaders", { withCredentials: true }).then(function (res) {
      setLeaders(res.data.leaderboard);
      console.log(res.data.leaderboard);
    });

    const addedHandler = addHandler("onlineStatus", handleOnlineNotif);
    return addedHandler;
  }, []);

  useEffect(() => {
    if (!user) return;

    api("/states/player-rooms/" + user?.id, { withCredentials: true }).then(
      function (res) {
        setGamesPlayed(res.data.rooms.length);
      }
    );

  }, [user]);


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
    <div
      className={`w-full h-full pr-5 pb-10 flex flex-row transition-all duration-700 ease-in-out ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className={`font-poppins w-full h-full flex flex-col gap-3 px-10`}>
        <h1 className="text-white font-bold text-[30px]">
          Hi, <span className="text-neon">{user?.username}</span>
        </h1>
        <div className="flex w-full h-2/5 gap-10">
          <div className="bg-compBg flex flex-row basis-3/5  grow rounded-[30px] p-10">
            <div className="flex flex-col gap-1 p-12 space-y-1">
              <div className="space-y-4">
                <h2 className="text-white font-bold text-[40px]/10">
                  Step Into the Ultimate Ping Pong Arena. Match With Players
                  Instantly & Test Your Skills.
                </h2>
                <p className="text-[#fff]/[50%] text-[20px]">
                  Jump into fast, fair, and exciting ping pong matchmaking.
                  Whether you're here to warm up, test your skills, our system
                  pairs you instantly with players at your level. Click below
                  and start playing now!
                </p>
              </div>
              <div className="pt-12">
                <button className="bg-neon shadow-neon shadow-[0_5px_40px_5px_rgba(0,0,0,0.4)] p-2 px-8 flex items-center rounded-full gap-2 w-fit">
                  <p className="text-white text-xl font-extrabold">Play Now</p>
                  {/* <div className=" bg-neon rounded-full">
                    <GrFormNextLink className="text-white w-7 h-7" />
                  </div> */}
                </button>
              </div>
            </div>
            <img src="/src/assets/paddle.png" className="w-[400px] h-[400px]" />
          </div>
          <div className="bg-compBg overflow-hidden relative basis-2/5 grow rounded-[30px]">
            <div className="flex flex-col justify-between p-10 relative gap-6 z-10 w-fit">
              <div className="">
                <h2 className="text-white font-bold text-[100px] h-fit">
                  {gamesPlayed}
                </h2>
                <p className="text-white font-extralight text-[40px] mt-[-35px]">
                  Games Played
                </p>
              </div>
              <button className="p-3 border-2 border-neon px-8 flex items-center rounded-full gap-2 w-fit">
                <p className="text-white font-bold">HISTORY</p>
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
                  <Area
                    type="monotone"
                    dataKey="uv"
                    stroke="#8884d8"
                    animationDuration={1100}
                    fill="#8884d8"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="flex w-full h-3/5 mt-5 gap-10">
          <div className="flex basis-3/5 h-fit">
            <div className="h-full">
              <div className="text-white flex justify-between items-center">
                <h3 className="font-bold text-[35px]">Tournaments</h3>
                <div className="flex items-center gap-1">
                  <h4>View All</h4>
                  <GrFormNextLink />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex w-2/5 flex-wrap justify-between h-full">
                  {tournaments?.slice(0, 4).map((tournament) => (
                    <TournamentCard tournament={tournament} />
                  ))}
                </div>
                <div className="flex flex-col gap-5 w-3/5 p-2 pl-5">
                  <LogCard />
                  <LogCard />
                  <LogCard />
                  <LogCard />
                  <LogCard />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col basis-2/5 h-full gap-2">
            <div className="text-white flex justify-between items-center">
              <h3 className="font-bold text-[35px]">Leaders</h3>
              <div className="flex items-center gap-1" onClick={() => navigate('/leaderboard')}>
                <h4>View All</h4>
                <GrFormNextLink />
              </div>
            </div>
            <div className="flex pb-8 flex-wrap w-full justify-between h-full">
              {leaders.slice(0, 3).map((leader) => (
                <LeadersCard
                rank={leader.rank}
                username={leader.username}
                score={leader.score}
                avatar={leader.avatar}
              />
              ))}
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
      <div className="h-full flex flex-col max-w-[70px]">
        <div
          className={`bg-compBg flex flex-col rounded-[30px] min-h-[43.4%] mt-5 items-center gap-6 p-5`}
        >
          <MdGroups className="w-[27px] h-auto text-white mb-1" />
          <div
            ref={friendOptRef}
            className={`flex flex-col gap-6 transition-all duration-700 ease-in-out`}
          >
            {friends
              .filter((friend) => friend.user.username != "Deleted User")
              .slice(0, 7)
              .map((friend) => (
                <FriendBubble
                  friendOpt={friendOpt}
                  setFriendOpt={() => {
                    friendOpt == friend.user.id
                      ? setFriendOpt(0)
                      : setFriendOpt(friend.user.id);
                  }}
                  inGame={false}
                  user={friend.user}
                  isOnline={friend.user.online}
                />
              ))}
          </div>
        </div>
        <div
          className={`bg-compBg flex flex-col rounded-[30px] h-full my-7 items-center gap-6 p-5`}
        >
          <IoChatbubblesSharp className="w-[27px] h-auto text-white mb-2" />
          <div
            className={`flex flex-col gap-6 transition-all duration-700 ease-in-out`}
          >
            {friendsMessages
              .filter(
                (friend) =>
                  friend.user.username != "Deleted User" &&
                  friend.unreadCount > 0
              )
              .slice(0, 8)
              .map((friend) => (
                <MessageBubble
                  onclick={() => {
                    navigate("/chat/" + friend.user.username);
                  }}
                  user={friend.user}
                  unreadCount={friend.unreadCount}
                  isOnline={friend.user.online}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
