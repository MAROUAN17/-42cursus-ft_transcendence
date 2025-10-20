import { useState } from "react";
import { useNavigate } from "react-router";
import api from "../../../axios";

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
      api
        .post(`/tournament/start/${tournamentId}`, { playerId: String(playerId) }, { withCredentials: true })
        .then(function (res) {
          setStarted(true);
          alert(res.data.msg || "the tournament is started");
        })
        .catch(function (err) {
          console.error(err.response.data.error || "Failed to start tournament");
        });
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
      api.post(`/tournament/leave`, { playerId: String(playerId), tournamentId: tournamentId }, { withCredentials: true }).then(function(res) {
        alert(res.data.msg || "You left the tournament");
        if (onLeave) onLeave();
      }).catch(function(err) {
        console.log(err);
        alert(err.response.data.error || "Failed to leave tournament");
      });
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
      {label === "start" ? (
        <p className="font-bold text-xl">Ready to play, Click 'Start Game' to start the tournament</p>
      ) : (
        <p className="font-bold text-xl">Waiting for tournament to start ...</p>
      )}
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
