import { FaUsers, FaTrophy, FaDollarSign } from "react-icons/fa";
import type { Tournament } from "./tournaments";
import { useNavigate } from "react-router";
import { useUserContext } from "../contexts/userContext";
import { useState, useEffect } from "react";

export function TournamentCard({ id, name, players, createdAt, status }: Tournament) {
  const { user } = useUserContext();
  const [label, setLabel] = useState("JOIN");
  const maxParticipants = 4;
  const navigate = useNavigate();

  useEffect(() => {
    if (!players || !user) return;
    setLabel(players?.includes(user?.id) ? "JOINED" : "JOIN");
  }, [players, user]);
  const handelJoin = async () => {
    // if (status != "open")
    //     return ;
    console.log("Trying to join ...");
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tournament/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "player-id": user?.id.toString() || "1",
        },
        body: JSON.stringify({ tournamentId: id }),
      });

      const data = await res.json();
      console.log("Joined:", data);
    } catch (err) {
      console.error("Error joining tournament", err);
    }
  };
  return (
    <div className="font-poppins rounded-2xl overflow-hidden bg-gradient-to-b from-purple-600/90 to-purple-800/90 border border-purple-500/20 shadow-lg hover:shadow-purple-500/30 hover:scale-105 transition-transform duration-300">
      <div className="h-40 relative overflow-hidden cursor-pointer" onClick={() => navigate(`/bracket/${id}`)}>
        <img src={"/img.jpg"} alt={name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="p-5 space-y-4">
        <h3 className="text-white font-semibold text-lg truncate">{name}</h3>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-purple-200">
            <FaUsers className="w-4 h-4 text-green-400" />
            <span>
              {players?.length}/{maxParticipants} players
            </span>
          </div>
        </div>

        <button
          className={`w-full py-2.5 rounded-full font-semibold transition-all duration-200 
            ${
              status === "full"
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : status === "started"
                ? "bg-orange-500 text-white cursor-not-allowed"
                : "bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white shadow-md shadow-pink-500/30 hover:scale-[1.02]"
            }`}
          // disabled={status !== "open"}
          onClick={handelJoin}
        >
          {status === "full" ? "FULL" : status === "started" ? "STARTED" : label}
        </button>
      </div>
    </div>
  );
}
