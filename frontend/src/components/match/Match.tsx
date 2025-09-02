import React from 'react';
import { useEffect, useState } from 'react';
import im1 from "./imgs/user1.png"
import axios from 'axios';

export default function MatchMaking() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length < 3 ? prev + "." : ""));
    }, 500); 

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    console.log('entered');
    try {
      setLoading(true);
      const response = await axios.post('https://localhost:5000/match/pair',
      {
        username: 'melamarty',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'player-id': 'user-123',
        }
      }
    );

      console.log(response.data);
    } catch (err) {
      setError(err.message);
      console.error('API Error:', err);
    } finally {
      //setLoading(false);
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
        onClick={() => {leave_queue()}}
        className="bg-white hover:bg-gray-100 text-purple-600 font-bold py-4 px-8 rounded-full text-lg transition-colors shadow-lg">
          BACK
        </button>
      </div>
    </div>
  );
}