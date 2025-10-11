
import PlayerBox from "./playerBox";
import { redirect, useNavigate, useParams } from "react-router";
import LeaveButton from "./ui/leaveBtn";
import type { Tournament } from "./tournaments";
import { useEffect, useState } from "react";
import { useWebSocket } from "../chat/websocketContext";
import type { Round } from "../game/remote/Types";
import type { ProfileUserInfo } from "../../types/user";

//todo
//setup first round betwen player1 and player2
//displays the winners in the final
//plays the final round 

const TournamentBracket: React.FC = () => {
  
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [usernames, setUsernames] = useState<string[]>([]);
  const [started, setStarted] = useState(false);
  const [rounds, setRounds] = useState<Round[] | null>();
  const [finalPlayers, setFinalPlayers] = useState<number[]>([]);
  const [finalUsernames, setFinalUsernames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminLabel, setAdminLabel] = useState("waiting ...");
  const [round, setRound] = useState<Round>();
  
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {user} = useWebSocket();

  
  useEffect (() => {
    if (!user || !user.id)
        return ;
    const fetchROunds = async () => {
      const response = await fetch(`https://localhost:4000/tournament/rounds/${id}`, { method: 'GET' });
      if (!response.ok) throw new Error("Failed to fetch rounds");
      const data = await response.json();
      console.log("fetched rounds:", JSON.stringify(data));
      
      const maxRound = Math.max(...data.map((r: Round) => r.round_number));
      const latestRounds = data.filter((r: Round) => r.round_number === maxRound);

      const userRound = latestRounds.find(
        (r: Round) => r.player1 === Number(user?.id) || r.player2 === Number(user?.id)
      );

      if (userRound) {
        setRound(userRound);
        console.log("User Round Found:", userRound);
      } else {
        console.warn("User is not part of any round in the latest round.", Number(user?.id));
      }

      // sessionStorage.setItem("currentGame", JSON.stringify(data));
      // setRounds(data);
      const round2 = data.filter((r: any) => r.round_number === 2);
      const players = round2.flatMap((r: any) => [r.player1, r.player2]);
      setFinalPlayers(players);

      // console.log("Final round players:", players);

      return ;
    }
    fetchROunds();
    // return;
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(`https://localhost:4000/tournament/start_games/${id}`);
        if (response.ok) {
          const tournament = await response.json();
          if (tournament.status === "ongoing") {
            clearInterval(intervalId);
            
            // navigate("/remote_game");
          }
        } else {
          console.log("still waiting for players ...");
        }
      } catch (error) {
        console.error("Error fetching tournament:", error);
      }
    }, 1000);

    return () => clearInterval(intervalId);

  }, [started, user]);
  useEffect (() => {
    if (!user || !round) return ;
    sessionStorage.setItem("currentRound", JSON.stringify(round));
    // const roundNb = sessionStorage.getItem("roundNb");
    console.log("Round winner :", round.winner);
    if (!round.winner)
        navigate("/remote_game");
    // if (roundNb != "2")
    //   navigate("/remote_game");
    // else
    //   console.log("this is the final round");
    // if (finalPlayers.length == 2)
    //   redirect("/remote_game")
    // else
    //   console.log("not enough final players");
  }, [user, round])
  async function fetchUsername(playerId: number) {
    const response = await fetch(`https://localhost:4000/user/${playerId}`, { method: 'GET' });
    if (!response.ok) throw new Error("Failed to fetch user");
    const data = await response.json();
    
    return data.infos.username;
  }
  useEffect(() => {
    console.log("rounds seted: " , rounds)
    if (finalPlayers){
      // redirect to remote game
    }
  }, [rounds])


  useEffect(() => {
    if (tournament) {
      // console.log("Tournament players:", tournament.players);
      Promise.all(tournament.players.map((id) => fetchUsername(id)))
      .then((names) => {
          console.log("Fetched usernames:", names, id);
          setUsernames(names);
        })
        .catch((err) => console.error(err));
    }
  }, [tournament]);

  useEffect(() => {
    if (finalPlayers.length > 0) {
      Promise.all(finalPlayers.map((id) => fetchUsername(id)))
        .then((names) => {
          console.log("Fetched final usernames:", names);
          setFinalUsernames(names); 
        })
        .catch((err) => console.error(err));
    }
  }, [finalPlayers]);

  const Users = (usernames || []).map((username, index) => ({
    username,
    avatar: `https://i.pravatar.cc/40?img=${index + 1}`,
  }));

  const finalUsers = (finalUsernames || []).map((username, index) => ({
    username,
    avatar: `https://i.pravatar.cc/40?img=${index + 1}`,
  }));


  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const res = await fetch(`https://localhost:4000/tournament/${id}`);
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        const data: Tournament = await res.json();
        setTournament(data);
        if (data.players.length === 4)
          setAdminLabel("start");
        // console.log("fetched data:", tournament?.players);
      } catch (err: any) {
        console.error("Error", err.message);
      } finally {
        setLoading(false);
      }
    };
    const fetchFinalROund = async () => {
		console.log("trying to fetch final round ")
		try {
         const response = await fetch(`https://localhost:4000/tournament/final_round/${id}`);
         if (response.ok) {
           const finalROund = await response.json();
           console.log("Final Round fetched: ", finalROund);
         } else {
           console.log("still waiting for players ...");
         }
      } catch (error) {
        console.error("Error fetching tournament:", error);
      }
	}
    fetchTournament();

    fetchFinalROund();
  }, [id]);

  

  if (loading) return <p>Loading tournament...</p>;
  return (
    <div className="bg-[#0a043c] text-white min-h-screen flex flex-col items-center justify-center gap-10">
      <div className="w-full flex justify-end p-4 cursor-pointer">
        <LeaveButton setStarted={setStarted} label={tournament?.admin  == user?.id ? adminLabel : "leave"} tournamentId={Number(id)} playerId={user?.id || 1} onLeave={() => navigate("/tournaments")} />
      </div>

      <div className="relative h-40 overflow-hidden cursor-pointer  text-white rounded-lg">
        <div className="flex flex-col items-center justify-center h-full">
          <h1>id is {user?.id} {user?.username}</h1>
          <div className="flex gap-32 items-center">

            <div className="flex gap-12 items-center">
              <div className="relative flex flex-col gap-10">
                <PlayerBox { ...Users[0]} />
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

