import { useState } from "react";

interface Props {
  show: boolean;
  onClose: () => void;
  onCreated: (newTournament: any) => void;
}

export function CreateTournament({ show, onClose, onCreated }: Props) {
  const [tournamentName, setTournamentName] = useState("");

  const handleCreate = async () => {
    if (!tournamentName.trim()) return;

    try {
      const res = await fetch("https://localhost:4000/tournament/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "player-id": "1",
        },
        body: JSON.stringify({ name: tournamentName }),
      });

      const data = await res.json();
      console.log("Created:", data);

      onCreated(data);

      setTournamentName("");
      onClose();
    } catch (err) {
      console.error("Error creating tournament:", err);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-gradient-to-br from-purple-800 to-indigo-900 p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">Create Tournament</h2>

        <input
          type="text"
          value={tournamentName}
          onChange={(e) => setTournamentName(e.target.value)}
          placeholder="Tournament Name"
          className="w-full p-3 mb-4 rounded-lg 
                    bg-purple-700/40 border border-purple-500/40 
                    text-white placeholder:text-purple-300
                    focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-semibold hover:scale-105 transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
