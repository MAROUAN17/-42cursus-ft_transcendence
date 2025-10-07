import { useState } from "react";
import { useNavigate } from "react-router";

interface LeaveButtonProps {
  label: string;
  tournamentId: number;
  playerId: number;
  onLeave?: () => void;
  setStarted: (started:boolean) => void;
}

const LeaveButton: React.FC<LeaveButtonProps> = ({setStarted, label, tournamentId, playerId, onLeave }) => {
  const [loading, setLoading] = useState(false);
  const handelStart = async () => {
     try {
      setLoading(true);
      const res = await fetch(`https://localhost:4000/tournament/start/${tournamentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "player-id": String(playerId),
        },
        body: JSON.stringify({})
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
  }
  const handleLeave = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://localhost:4000/tournament/leave", {
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
  const handelAction = () =>
  {
    if (label === "start")
        handelStart();
    else if (label == "leave")
        handleLeave();
  }

  return (
    <button
      onClick={handelAction}
      disabled={loading}
      className={`absolute top-2 right-2 text-white px-8 py-3 rounded-lg shadow cursor-pointer text-sm font-medium ${
        label === "start" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
      }`}
    >
      {label}
  </button>

  );
};

export default LeaveButton;
