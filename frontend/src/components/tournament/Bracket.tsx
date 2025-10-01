import PlayerBox from "./playerBox";
import { useNavigate, useParams } from "react-router";
import LeaveButton from "./ui/leaveBtn";
import type { Tournament } from "./tournaments";
import { useEffect, useState } from "react";
import { useWebSocket } from "../contexts/websocketContext";

const TournamentBracket: React.FC = () => {
  async function fetchUsername(playerId: number) {
    const response = await fetch(`https://localhost:5000/user/${playerId}`, {
      method: "GET",
    });
    if (!response.ok) throw new Error("Failed to fetch user");
    const data = await response.json();
    console.log("fetched username:", data.infos.username);
    return data.infos.username;
  }

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [usernames, setUsernames] = useState<string[]>([]);

  useEffect(() => {
    if (tournament) {
      console.log("Tournament players:", tournament.players);
      Promise.all(tournament.players.map((id) => fetchUsername(id)))
        .then((names) => {
          console.log("Fetched usernames:", names, id);
          setUsernames(names);
        })
        .catch((err) => console.error(err));
    }
  }, [tournament]);
  const Users = (usernames || []).map((username, index) => ({
    username,
    avatar: `https://i.pravatar.cc/40?img=${index + 1}`,
  }));

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const playerId = 1;
  const [loading, setLoading] = useState(true);
  const [adminLabel, setAdminLabel] = useState("waiting ...");

  const { user } = useUserContext();
  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const res = await fetch(`https://localhost:5000/tournament/${id}`);
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        const data: Tournament = await res.json();
        setTournament(data);
        if (tournament?.players.length === 4) setAdminLabel("start");
        console.log("fetched data:", data);
      } catch (err: any) {
        console.error("Error", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTournament();
  }, [id]);

  if (loading) return <p>Loading tournament...</p>;
  return (
    <div className="bg-[#0a043c] text-white min-h-screen flex flex-col items-center justify-center gap-10">
      <div className="w-full flex justify-end p-4 cursor-pointer">
        <LeaveButton
          label={tournament?.admin == user?.id ? adminLabel : "leave"}
          tournamentId={Number(id)}
          playerId={1}
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
                <PlayerBox {...Users[5]} />
              </div>
            </div>

            <div className="flex gap-12 items-center">
              <div className="flex flex-col items-start">
                <PlayerBox {...Users[5]} />
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
