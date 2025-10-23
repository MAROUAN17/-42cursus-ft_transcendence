import PlayerBox from "./playerBox";
import { redirect, useNavigate, useParams } from "react-router";
import LeaveButton from "./ui/leaveBtn";
import type { Tournament } from "./tournaments";
import { useEffect, useState } from "react";
import { useWebSocket } from "../contexts/websocketContext";
import type { Player, Round } from "../game/remote/Types";
import { useUserContext } from "../contexts/userContext";
import type { Game } from "../game/remote/Types";
import type { EventPacket } from "../../types/websocket";
import api from "../../axios";
import { FaCrown } from "react-icons/fa";

//todo
//setup first round betwen player1 and player2
//displays the winners in the final
//plays the final round

const TournamentBracket: React.FC = () => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [started, setStarted] = useState(false);
  const [finalPlayers, setFinalPlayers] = useState<Player[]>([]); // now contains full player objects
  const [loading, setLoading] = useState(true);
  const [adminLabel, setAdminLabel] = useState("waiting ...");
  const [round, setRound] = useState<Round | null>(null);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { send } = useWebSocket();
  const { user } = useUserContext();
  const [finalWinner, setFinalWinner] =  useState(null);
  useEffect(() => {
    if (!finalWinner)
        return ;
      console.log( "final Winner ----------------------------------------- : ", finalWinner)
  })
  useEffect(() => {
    if (!user || !user.id) return;

    const fetchRounds = async () => {
      let data;
      var latestRounds;
      await api(`/tournament/rounds/${id}`, { withCredentials: true }).then(function (res) {
        data = res.data;
        const maxRound = Math.max(...data.map((r: Round) => r.round_number));
        latestRounds = data.filter((r: Round) => r.round_number === maxRound);
        console.log("Fetched rounds:", latestRounds[0]);
        if (maxRound == 2)
            setFinalWinner(latestRounds[0].winner);
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
      });
      // if (!response.ok) throw new Error("Failed to fetch rounds");
      // const data = await response.json();

      // console.log("round 2 : ", round2)
    };

    fetchRounds();

    const intervalId = setInterval(async () => {
      try {
        await api(`/tournament/start_games/${id}`, { withCredentials: true })
          .then(function (res) {
            const tournament = res.data;
            if (tournament.status === "ongoing") {
              clearInterval(intervalId);
              // setStarted(true);
              // navigate("/remote_game");
            }
          })
          .catch(function (err) {
            console.log("Still waiting for players...");
          });
      } catch (error) {
        console.error("Error fetching tournament:", error);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [started, user, id]);

  function sendAlert(roundNum: number) {
    console.log("before ----------------");
    if (!tournament || !user || (roundNum != 2 && (!tournament || !user))) return;
    const packet: EventPacket = {
      type: "gameEvent",
      data: {
        tournamentId: tournament.id,
        senderId: user.id,
        round: roundNum,
        admin: tournament.admin,
      },
    };
    console.log("sending ----------------");
    send(JSON.stringify(packet));
  }

  useEffect(() => {
    if (!user || !round) return;
    const player1: Player = {
      username: get_username(round.player1),
      avatar: get_avatar(round.player1),
    };
    const player2: Player = {
      username: get_username(round.player2),
      avatar: get_avatar(round.player2),
    };
    console.log("player1 : ", player1, "player2: ", player2);
    const game: Game = {
      side: round.player1 == user.id ? "left" : "right",
      round: round,
      you: user.id == round.player1 ? player1 : player2,
      opponent: user.id == round.player2 ? player1 : player2,
    };
    console.log("game :", game);
    sessionStorage.setItem("currentRound", JSON.stringify(game));
    if (!round.winner) {
      // notifying
      console.log("admin sent notif");
      sendAlert(round.round_number);
      console.log("round number - > ", round.round_number);
      setTimeout(() => {
        navigate("/remote_game");
      }, 1000);
      // navigate("/remote_game");
    }
  }, [user, round]);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        api(`/tournament/${id}`, { withCredentials: true })
          .then(function (res) {
            setTournament(res.data);
            if (res.data.players.length === 4) setAdminLabel("start");
            console.log("-- fetched tournament:", res.data);
          })
          .catch(function (err) {
            throw new Error(`Error ${err.response.status}: ${err.response.statusText}`);
          });
      } catch (err: any) {
        console.error("Error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchFinalRound = async () => {
      try {
        await api(`/tournament/final_round/${id}`, { withCredentials: true })
          .then(function (res) {
            console.log("Final Round fetched:", res.data);
          })
          .catch(function (err) {
            console.log("Still waiting for players...");
          });
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
  const get_username = (p: any) => {
    for (let i = 0; i < tournament?.players.length; i++) {
      if (tournament?.players[i].id == p) return tournament?.players[i].username;
    }
  };
  const get_avatar = (p: any) => {
    for (let i = 0; i < tournament?.players.length; i++) {
      if (tournament?.players[i].id == p) return tournament?.players[i].avatar;
    }
  };
  const finalUsers =
    finalPlayers?.map((p, index) => ({
      username: get_username(p),
      avatar: get_avatar(p),
    })) || [];

  useEffect(() => {
    console.log("final Players-- :", finalPlayers);
    console.log("final Users -- :", finalUsers);
    console.log("final round winner stirng -- :", finalPlayers[0]);
    console.log("final round winner u -- :", finalUsers[0]?.id);
    console.log("final round winner -- :", round);
  }, [finalUsers, finalPlayers]);

  if (loading) return <p>Loading tournament...</p>;
  return (
    <div className="font-poppins text-white min-h-screen flex flex-col w-full h-full items-center justify-center gap-10">
      <h1 className="flex justify-top text-white font-bold text-2xl">{tournament?.name}</h1>
      <div className="relative h-full overflow-hidden cursor-pointer  text-white rounded-lg">
        <div className="flex flex-col items-center justify-center h-full">
          {finalWinner  ? (
            <div className="relative flex flex-col justify-center items-center gap-3">
              <div className="flex justify-center space-x-28">
                <div className="flex flex-col items-center ">
                  <FaCrown className="w-[40px] h-[40px] text-yellow-500" />
                  <img
                    className="w-[110px] h-[110px] rounded-full object-cover border-4 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]"
                    src={finalWinner == Number(finalPlayers[0]) ? finalUsers[0].avatar : finalUsers[1].avatar}
                    alt="winner-avatar"
                  />
                </div>
                <img className="absolute w-[120px] h-[120px] top-9" src="/trophy.png" alt="winner-trophy" />
              </div>
              <div className="">
                <h1 className="text-white font-bold text-xl">
                  {finalWinner == Number(finalPlayers[0]) ? finalUsers[0].username?.toUpperCase() : finalUsers[1].username?.toUpperCase()}
                </h1>
              </div>
            </div>
          ) : null}
          <div className="flex gap-32 items-center">
            <div className="flex gap-12 items-center">
              <div className="relative flex flex-col gap-24">
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

              <div className="relative flex flex-col gap-24">
                <PlayerBox {...Users[2]} />
                <PlayerBox {...Users[3]} />

                <div className="absolute right-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2 w-8 h-px bg-white"></div>
                <div className="absolute right-[calc(100%+0.5rem)] top-0 bottom-0 w-px bg-white mx-auto"></div>
              </div>
            </div>
          </div>

          <LeaveButton
            setStarted={setStarted}
            label={tournament?.admin == user?.id ? adminLabel : "leave"}
            tournamentId={Number(id)}
            playerId={user?.id || 1}
            onLeave={() => navigate("/tournaments")}
            tournamentState={tournament?.status}
          />
        </div>
      </div>
    </div>
  );
};

export default TournamentBracket;
