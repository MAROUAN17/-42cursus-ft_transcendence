import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "../../../axios";

interface LeaveButtonProps {
  label: string;
  tournamentId: number;
  playerId: number;
  onLeave?: () => void;
  setStarted: (started: boolean) => void;
  tournamentState: string;
}

const LeaveButton: React.FC<LeaveButtonProps> = ({ setStarted, label, tournamentId, playerId, onLeave, tournamentState }) => {
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
      api
        .post(`/tournament/leave`, { playerId: String(playerId), tournamentId: tournamentId }, { withCredentials: true })
        .then(function (res) {
          alert(res.data.msg || "You left the tournament");
          if (onLeave) onLeave();
        })
        .catch(function (err) {
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

  useEffect(() => {
    console.log("label -> ", label);
    console.log(tournamentState);
  }, [label]);

  return (
    <div className="flex flex-col space-y-8 items-center mt-24">
      {tournamentState === "open" && label === "waiting ..." ? (
        <p className="font-bold text-xl">Waiting for other players to join ...</p>
      ) : tournamentState === "open" && label === "start" ? (
        <p className="font-bold text-xl">Ready to play, Click 'Start Tournament' to start the tournament games</p>
      ) : tournamentState === "ongoing" && label === "start" ? (
        <p className="font-bold text-xl">The tournament already started..</p>
      ) : tournamentState === "finished" ? (
        <p className="font-bold text-xl">The tournament already finished</p>
      ) : null}

      {(tournamentState == "open" || "full") && tournamentState != "finished" ? (
        <button
          onClick={handelAction}
          disabled={loading}
          className={`mt-24 text-white px-8 py-3 rounded-lg shadow cursor-pointer text-sm font-medium ${
            label === "start" ? "bg-green-700 hover:bg-neon hover:scale-110" : "bg-gray-600"
          }`}
        >
          {label === "start" ? "Start Tournament" : "Leave"}
        </button>
      ) : null}
    </div>
  );
};

export default LeaveButton;
