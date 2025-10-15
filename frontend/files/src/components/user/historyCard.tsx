import type { MatchHistory } from "../../types/profile";

interface props {
  userId: number;
  match: MatchHistory;
}

export default function HistoryCard({ match, userId }: props) {
  return (
    <div className="bg-compBg/20 px-12 py-5 text-white flex justify-between items-center">
      <div className="flex justify-center items-center space-x-3 w-[200px]">
        <img src={userId == match.player1 ? match.p2_avatar : match.p1_avatar} className="shrink-0 object-cover w-[40px] h-[40px] rounded-full" />
        <h1 className="font-bold">{userId == match.player1 ? match.player2_name : match.player1_name}</h1>
      </div>
      <div className="flex justify-center w-[200px]">
        <h1 className="font-bold">Player vs Player</h1>
      </div>
      <div className="flex justify-center w-[200px]">
        {userId == match.winner ? (
          <div className="border bg-[#05C168]/20 text-[#14CA74] font-medium border-[#14CA74]/50 px-3 py-2 rounded-lg">
            <h1 className="font-bold">Win</h1>
          </div>
        ) : (
          <div className="border bg-[#C10508]/20 text-[#C10508] font-medium border-[#C10508]/50 px-3 py-2 rounded-lg">
            <h1 className="font-bold">Lost</h1>
          </div>
        )}
      </div>
      <div className="flex justify-center w-[200px]">
        <h1 className="font-bold">
          {match.scoreLeft} - {match.scoreRight}
        </h1>
      </div>
      <div className="flex justify-center w-[200px]">
        <h1 className="font-bold">{match.startedAt.replace('(Coordinated Universal Time)', ' ')}</h1>
      </div>
    </div>
  );
}
