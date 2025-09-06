import React from 'react';
import { useEffect, useState } from 'react';
import im1 from "./imgs/user1.png"
import axios from 'axios';
import { useNavigate } from 'react-router';


export default function Pairing() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [dots, setDots] = useState("");
  const [gameInfo, setGameInfo] = useState(null);
  const [username, setUsername] = useState("");
  const [paired, setPaired] = useState(false);
  const [countdown, setCountdown] = useState(5);


  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length < 3 ? prev + "." : ""));
    }, 500); 

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timer;
    if (paired) {
      console.log("players are paired")
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
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
          const response = await axios.get("https://localhost:5000/match/my-game", {
            headers: {
              "player-id": username + "id",
            },
          });
  
          if (response.data.game) {
            setGameInfo(response.data.game);
            setLoading(false);
  
            sessionStorage.setItem("currentGame", JSON.stringify(response.data.game));
            setPaired(true)
            setTimeout(() => {
              navigate("/remote_game");
            }, 5000);
  
            clearInterval(interval);
          }
        } catch (err) {
          if (err.response) {
            console.error("Error data:", err.response.data);
            console.error("Error status:", err.response.status);
            console.error("Error headers:", err.response.headers);
          } else {
            console.error("Error message:", err.message);
          }
        }
      }
    }, 1000); 
  
    return () => clearInterval(interval);
  }, [loading, username, navigate]);
  

  const fetchData = async () => {
    console.log('entered');
    try {
      setLoading(true);
      const response = await axios.post('https://localhost:5000/match/pair',
      {
        username: username,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'player-id': username + "id",
        }
      }
    );

      console.log(response.data);
    } catch (err) {
      if (err.response) {
        console.error('Error data:', err.response.data);
        console.error('Error status:', err.response.status);
        console.error('Error headers:', err.response.headers);
      } else {
        console.error('Error message:', err.message);
      }
    }
  };
  const leave_queue = async () => {
    try {
      const response = await axios.delete('https://localhost:5000/match/leave-queue', {
        headers: {
          'player-id': 'user-123',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Left queue:', response.data);
      
    } catch (err) {
      console.error('Error leaving queue:', err);
      setError(err.message);
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-20 tracking-widest">
        MATCHMAKING
      </h1>
      

      <div className="flex flex-col items-center gap-4">
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                   focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
      />

    </div>
      <div className="flex items-center justify-center mb-20 w-full max-w-4xl">
        <div className="flex flex-col items-center relative">
          <div className="relative">
            <img
              src={im1}
              alt="Player 1"
              className="w-20 h-20 md:w-24 md:h-24 rounded-full border-3 border-purple-400 object-cover"
            />
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap">
              player1
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-purple-500 border-2 border-purple-400"></div>
          <div className="w-20 md:w-32 h-1 bg-purple-500"></div>
        </div>

        <div className="relative mx-4">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-purple-400 bg-indigo-900 flex items-center justify-center">
            <span className="text-white text-3xl md:text-4xl font-bold">VS</span>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-20 md:w-32 h-1 bg-purple-500"></div>
          <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-purple-500 border-2 border-purple-400 flex items-center justify-center">
            <span className="text-white text-xl md:text-2xl font-bold">?</span>
          </div>
        </div>

        <div className="flex flex-col items-center relative opacity-0">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-3 border-purple-400 bg-purple-500 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">?</span>
          </div>
        </div>
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
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white 
                          w-24 h-24 rounded-full flex items-center justify-center 
                          text-4xl font-extrabold shadow-xl animate-pulse">
            {countdown}
          </div>
        </div>
    )}

    </div>
  );
}