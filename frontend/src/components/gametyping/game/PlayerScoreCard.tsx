interface PlayerScoreCardProps {
  score: number;
  avatarUrl: string;
  color?: "green" | "red"; // For border color
}

export default function PlayerScoreCard({ score, avatarUrl, color = "green" }: PlayerScoreCardProps) {
  return (
    <div className="flex flex-col items-center">
      <div className={`rounded-full border-4 ${color === "green" ? "border-green-400" : "border-red-400"} w-24 h-24 flex items-center justify-center mb-2`}>
        <img src={avatarUrl} alt="Player avatar" className="w-20 h-20 rounded-full object-cover" />
      </div>
      <div className="bg-[#4B1D8F] rounded-xl px-4 py-2 text-center">
        <div className="text-3xl font-bold text-white">{score}</div>
        <div className="text-sm text-white opacity-70">Score</div>
      </div>
    </div>
  );
}