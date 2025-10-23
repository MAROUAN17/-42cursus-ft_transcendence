import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { type Player, type Game } from "../game/remote/Types";
import { useUserContext } from "../contexts/userContext";
import api from "../../axios";

export default function Pairing() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [dots, setDots] = useState("");
  const [gameInfo, setGameInfo] = useState<Game>(null);
  const [opponent, setOpponent] = useState<Player>({
    username: "?",
    avatar: "?",
  });
  const [paired, setPaired] = useState(false);
  const [countdown, setCountdown] = useState(2);

  const navigate = useNavigate();
  const { user } = useUserContext();
  const id = user?.id ? user.id.toString() : "";

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timer;
    if (paired) {
      console.log("players are paired", gameInfo);
      setOpponent(gameInfo.opponent);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            leave_queue();
            navigate("/remote_game");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [paired, navigate]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (loading) {
        try {
          api
            .get(`/match/my-game/${id}`, { withCredentials: true })
            .then(function (response) {
              console.log("------", response.data.game);
              setGameInfo(response.data.game);
              setLoading(false);
              sessionStorage.setItem("currentGame", JSON.stringify(response.data.game));
              setPaired(true);
              clearInterval(interval);
            })
            .catch(function (err) {
              if (err.response) {
                console.error("Error data:", err.response.data);
                console.error("Error status:", err.response.status);
                console.error("Error headers:", err.response.headers);
              } else {
                console.error("Error message:", err.message);
              }
            });

          // if (response.data.game) {
          //   console.log("------", response.data.game);
          //   setGameInfo(response.data.game);
          //   setLoading(false);

          //   sessionStorage.setItem("currentGame", JSON.stringify(response.data.game));
          //   setPaired(true);
          //   clearInterval(interval);
          // }
        } catch (err) {
          // if (err.response) {
          //   console.error("Error data:", err.response.data);
          //   console.error("Error status:", err.response.status);
          //   console.error("Error headers:", err.response.headers);
          // } else {
          //   console.error("Error message:", err.message);
          // }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [loading, navigate]);

  useEffect(() => {
    opponent.avatar = "9896174.jpg";
  }, []);

  const fetchData = async () => {
    console.log("entered");
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/match/pair`,
        {
          username: user?.username,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "player-id": id,
          },
          withCredentials: true
        },
      );

      console.log(response.data);
    } catch (err) {
      if (err.response) {
        console.error("Error data:", err.response.data);
        console.error("Error status:", err.response.status);
        console.error("Error headers:", err.response.headers);
      } else {
        console.error("Error message:", err.message);
      }
    }
  };
  const leave_queue = async () => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/match/leave-queue`, {
        headers: {
          "player-id": id,
          "Content-Type": "application/json",
        },
      });

      console.log("Left queue:", response.data);
    } catch (err) {
      console.error("Error leaving queue:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-poppins w-full h-full flex flex-col items-center">
      <h1 className="text-6xl font-bold text-white">MATCHMAKING</h1>
      <div className="flex flex-col items-center">
        {/* <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                   focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
      /> */}
      </div>
      <div className="relative flex flex-col justify-center items-center h-full w-full ">
        <div className="relative">
          <div className="space-y-3 absolute left-[80px] top-[225px] z-10">
            <img
              src={user?.avatar}
              alt={`${user?.avatar}-profile`}
              className="w-[150px] h-[150px] rounded-full border-3 border-purple-400 object-cover"
            />
            <div className="text-center relative left-1/2 transform -translate-x-1/2 bg-neon text-white px-4 py-2 rounded-full text-sm font-bold">
              {user?.username}
            </div>
          </div>

          {/* <div className="flex items-center ">
            <div className="w-20 md:w-32 h-1 bg-purple-500"></div>
          </div> */}

          <div className="relative mx-4">
            {/* <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-purple-400 bg-indigo-900 flex items-center justify-center">
              <span className="text-white text-3xl md:text-4xl font-bold">VS</span>
            </div> */}
            <img src="Rectangle.png" alt="rectangle" className="w-[1200px] h-[600px]" />
          </div>

          <div className="space-y-3 items-center absolute right-[80px] top-[225px]">
            {/* <div className="md:w-32 h-1 bg-purple-500 "></div> */}
            <img
              src={opponent?.avatar}
              alt={`${user?.avatar}-profile`}
              className="w-[150px] h-[150px] rounded-full border-3 border-purple-400 object-cover"
            />
            <div className="text-center relative left-1/2 transform -translate-x-1/2 bg-neon text-white px-4 py-2 rounded-full text-sm font-bold">
              {opponent.username}
            </div>
          </div>

          {/* <div className="flex flex-col items-center relative opacity-0">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-3 border-purple-400 bg-purple-500 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">?</span>
            </div>
          </div> */}
        </div>
        {!paired ? (
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <button
              onClick={() => fetchData()}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-colors shadow-lg flex items-center justify-center gap-1"
            >
              {loading ? (
                <>
                  <span>Pairing</span>
                  <span className="tracking-widest">{dots}</span>
                </>
              ) : (
                "Play Game"
              )}
            </button>

            <button
              onClick={() => leave_queue()}
              className="bg-white hover:bg-gray-100 text-purple-600 font-bold py-4 px-8 rounded-full text-lg transition-colors shadow-lg"
            >
              BACK
            </button>
          </div>
        ) : (
          <div className="countdown flex flex-col items-center justify-center mt-6 space-y-4">
            <p className="text-xl md:text-2xl font-semibold text-gray-200 tracking-wide">
              Match will <span className="text-purple-400">start</span> in
            </p>
            <div
              className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white 
                          w-24 h-24 rounded-full flex items-center justify-center 
                          text-4xl font-extrabold shadow-xl animate-pulse"
            >
              {countdown}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
