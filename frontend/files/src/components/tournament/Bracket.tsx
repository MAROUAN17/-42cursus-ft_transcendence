import PlayerBox from "./playerBox";
import { redirect, useNavigate, useParams } from "react-router";
import LeaveButton from "./ui/leaveBtn";
import type { Tournament } from "./tournaments";
import { useEffect, useState } from "react";
import { useWebSocket } from "../contexts/websocketContext";
import type { Round } from "../game/remote/Types";
import type { ProfileUserInfo } from "../../types/user";
import { useUserContext } from "../contexts/userContext";
import type { Game } from "../game/remote/Types";

//todo
//setup first round betwen player1 and player2
//displays the winners in the final
//plays the final round

const TournamentBracket: React.FC = () => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [started, setStarted] = useState(false);
  const [rounds, setRounds] = useState<Round[] | null>(null);
  const [finalPlayers, setFinalPlayers] = useState<Player[]>([]); // now contains full player objects
  const [loading, setLoading] = useState(true);
  const [adminLabel, setAdminLabel] = useState("waiting ...");
  const [round, setRound] = useState<Round | null>(null);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    if (!user || !user.id) return;

    const fetchRounds = async () => {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tournament/rounds/${id}`, { method: "GET" });
      if (!response.ok) throw new Error("Failed to fetch rounds");
      const data = await response.json();
      console.log("Fetched rounds:", JSON.stringify(data));

      const maxRound = Math.max(...data.map((r: Round) => r.round_number));
      const latestRounds = data.filter((r: Round) => r.round_number === maxRound);

      const userRound = latestRounds.find((r: Round) => r.player1 === Number(user.id) || r.player2 === Number(user.id));

      if (userRound) {
        setRound(userRound);
        console.log("User Round Found:", userRound);
      } else {
        console.warn("User is not part of any round in the latest round.");
      }

      const round2 = data.filter((r: Round) => r.round_number === 2);
      const playerIds = round2.flatMap((r: any) => [r.player1, r.player2]);
      setFinalPlayers(playerIds);
    };

    fetchRounds();

    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tournament/start_games/${id}`);
        if (response.ok) {
          const tournament = await response.json();
          if (tournament.status === "ongoing") {
            clearInterval(intervalId);
            // setStarted(true);
            // navigate("/remote_game");
          }
        } else {
          console.log("Still waiting for players...");
        }
      } catch (error) {
        console.error("Error fetching tournament:", error);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [started, user, id]);

  useEffect(() => {
    if (!user || !round) return;
    const game: Game = {
      side: round.player1 == user.id ? "left" : "right",
      round: round,
    };
    sessionStorage.setItem("currentRound", JSON.stringify(game));
    if (!round.winner) {
      // notifying
      navigate("/remote_game");
    }
  }, [user, round]);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tournament/${id}`);
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

        const data: Tournament = await res.json();
        setTournament(data);

        if (data.players.length === 4) setAdminLabel("start");
        console.log("-- fetched tournament:", data);
      } catch (err: any) {
        console.error("Error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchFinalRound = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tournament/final_round/${id}`);
        if (response.ok) {
          const finalRound = await response.json();
          console.log("Final Round fetched:", finalRound);
        } else {
          console.log("Still waiting for players...");
        }
      } catch (error) {
        console.error("Error fetching final round:", error);
      }
    };

    fetchTournament();
    fetchFinalRound();
  }, [id]);

  const Users =
    tournament?.players?.map((p, index) => ({
      username: p.username,
      avatar: p?.avatar,
    })) || [];

  const finalUsers =
    finalPlayers?.map((p, index) => ({
      username: p.username,
      avatar: p?.avatar,
    })) || [];

  if (loading) return <p>Loading tournament...</p>;
  return (
    <div className=" text-white min-h-screen flex flex-col w-full h-full items-center justify-center gap-10">
      <div className="w-full flex justify-end p-4 cursor-pointer">
        <LeaveButton
          setStarted={setStarted}
          label={tournament?.admin == user?.id ? adminLabel : "leave"}
          tournamentId={Number(id)}
          playerId={user?.id || 1}
          onLeave={() => navigate("/tournaments")}
        />
      </div>

      <div className="relative h-40 overflow-hidden cursor-pointer  text-white rounded-lg">
        <div className="flex flex-col items-center justify-center h-full">
          <h1>
            id is {user?.id} {user?.username}
          </h1>
          <div className="flex gap-32 items-center">
            <div className="flex gap-12 items-center">
              <div className="relative flex flex-col gap-10">
                <PlayerBox {...Users[0]} />
                <PlayerBox {...Users[1]} />

                <div className="absolute left-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2 w-8 h-px bg-white"></div>
                <div className="absolute left-[calc(100%+0.5rem)] top-0 bottom-0 w-px bg-white mx-auto"></div>
              </div>

              <div className="flex flex-col items-start">
                <PlayerBox {...finalUsers[0]} />
              </div>
            </div>

            <div className="flex gap-12 items-center">
              <div className="flex flex-col items-start">
                <PlayerBox {...finalUsers[1]} />
              </div>

              <div className="relative flex flex-col gap-10">
                <PlayerBox {...Users[2]} />
                <PlayerBox {...Users[3]} />

                <div className="absolute right-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2 w-8 h-px bg-white"></div>
                <div className="absolute right-[calc(100%+0.5rem)] top-0 bottom-0 w-px bg-white mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentBracket;
