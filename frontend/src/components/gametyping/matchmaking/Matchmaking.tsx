import GradientBar from "./GradientBar";
import MatchmakingHeader from "./MatchmakingHeader";
import PlayerCard from "./PlayerCard";
import VsIcon from "./VsIcon";
import MatchmakingActions from "./MatchmakingActions";
export default function Matchmaking() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0035]">
      <MatchmakingHeader />
      <div className="flex items-center justify-center w-full max-w-3xl mb-16">
        <PlayerCard
          avatarUrl="/player.png"
          name="player1"
          gradientColor="from-purple-500 to-purple-400"
        />
        <GradientBar direction="left" />
        <VsIcon />
        <GradientBar direction="right" />
        <PlayerCard
          name="Waiting..."
          gradientColor="from-purple-500 to-purple-400"
          isWaiting
        />
      </div>
      <MatchmakingActions onPlay={() => {}} onBack={() => {}} />
    </div>
  );
}
