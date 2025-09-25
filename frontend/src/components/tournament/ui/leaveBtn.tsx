import { useState } from "react";
import { useNavigate } from "react-router";

interface LeaveButtonProps {
  label: string;
  tournamentId: number;
  playerId: number;
  onLeave?: () => void;
}

const LeaveButton: React.FC<LeaveButtonProps> = ({label, tournamentId, playerId, onLeave }) => {
  const [loading, setLoading] = useState(false);
  const handelStart = async () => {
    //
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
      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg shadow cursor-pointer text-sm font-medium"
    >
      {label}
    </button>
  );
};

export default LeaveButton;
