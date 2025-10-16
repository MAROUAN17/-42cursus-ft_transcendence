import { useEffect, useState } from "react";
import { TournamentCard } from "./tournamentCart";
import { FaSearch, FaPlus } from "react-icons/fa";
import { CreateTournament } from "./CreateTournament";
import type { PublicUserInfos } from "../../types/user";

export interface Tournament {
  id: number;
  name: string;
  players: PublicUserInfos[];
  createdAt: string;
  status: "open" | "started" | "full";
  admin: number;
}

export function Tournaments() {
  const [showModal, setShowModal] = useState(false);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  const handleCreated = (newTournament: any) => {
    setTournaments((prev) => [...prev, { ...newTournament }]);
  };
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await fetch("https://localhost:5000/tournament/all");
        if (!res.ok) throw new Error("Failed to fetch tournaments");
        const data: Tournament[] = await res.json();
        console.log("tournament :  ", data);
        setTournaments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);
  if (loading) return <p>Loading tournaments...</p>;
  return (
    <div className="font-poppins min-h-screen w-full from-blue-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-2 tracking-wider">GLOBAL TOURNAMENTS</h1>
          <p className="text-purple-200 text-lg">{tournaments.length} Available tournaments</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
            <input
              placeholder="Search for tournament"
              className="w-full pl-12 pr-4 py-3 rounded-full 
                          bg-purple-800/40 backdrop-blur 
                          border border-purple-500/30 
                          text-white placeholder:text-purple-300 
                          focus:outline-none focus:ring-2 focus:ring-purple-400/70 
                          transition-all duration-200"
            />
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 
                      bg-neon shadow-neon shadow-[0_5px_40px_5px_rgba(0,0,0,0.4)]                      
                      text-white font-semibold px-6 py-3 rounded-full 
                      transition-all duration-200 hover:scale-105"
          >
            <FaPlus className="w-5 h-5" />
            CREATE
          </button>
        </div>

        <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {tournaments.map((tournament) => (
            <TournamentCard key={tournament.id} {...tournament} />
          ))}
        </div>
      </div>

      <CreateTournament show={showModal} onClose={() => setShowModal(false)} onCreated={handleCreated} />
    </div>
  );
}
