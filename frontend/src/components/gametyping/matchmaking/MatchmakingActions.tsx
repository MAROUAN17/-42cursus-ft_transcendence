interface MatchmakingActionsProps {
  onPlay: () => void;
  onBack: () => void;
}

export default function MatchmakingActions({ onPlay, onBack }: MatchmakingActionsProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        className="bg-purple-500 text-white font-bold px-12 py-3 rounded-full shadow-lg text-lg transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        onClick={onPlay}
      >
        PLAY GAME
      </button>
      <button
        className="bg-white text-purple-500 font-bold px-12 py-3 rounded-full shadow text-lg transition hover:bg-purple-50"
        onClick={onBack}
      >
        BACK
      </button>
    </div>
  );
}