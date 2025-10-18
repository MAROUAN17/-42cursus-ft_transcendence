import { useState } from "react";
import { useNavigate } from "react-router";

interface LeaveButtonProps {
  label: string;
  tournamentId: number;
  playerId: number;
  onLeave?: () => void;
  setStarted: (started: boolean) => void;
}

const LeaveButton: React.FC<LeaveButtonProps> = ({ setStarted, label, tournamentId, playerId, onLeave }) => {
  const [loading, setLoading] = useState(false);
  const handelStart = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tournament/start/${tournamentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "player-id": String(playerId),
        },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error(data.error || "Failed to start tournament");
      } else {
        setStarted(true);
        alert(data.msg || "the tournament is started");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  const handleLeave = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tournament/leave`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "player-id": String(playerId),
        },
        body: JSON.stringify({ tournamentId }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to leave tournament");
      } else {
        alert(data.msg || "You left the tournament");
        if (onLeave) onLeave();
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  const handelAction = () => {
    if (label === "start") handelStart();
    else if (label == "leave") handleLeave();
  };

  return (
    <div className="flex flex-col space-y-8 items-center mt-24">
      {label === "start" ? 
        <p className="font-bold text-xl">Ready to play, Click 'Start Game' to start the tournament</p>
      : 
        <p className="font-bold text-xl">Waiting for tournament to start ...</p>
      }
      <button
        onClick={handelAction}
        disabled={loading}
        className={`mt-24 text-white px-8 py-3 rounded-lg shadow cursor-pointer text-sm font-medium ${
          label === "start" ? "bg-green-700 hover:bg-neon hover:scale-110" : "bg-gray-600"
        }`}
      >
        {label}
      </button>
    </div>
  );
};

export default LeaveButton;
