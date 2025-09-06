interface StatsBarProps {
  wpm: number;
  cpm: number;
  accuracy: number;
}

function StatCircle({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-[#13137c] rounded-full w-44 h-44 flex flex-col items-center justify-center shadow-lg mx-2">
      <span className="text-white text-5xl font-bold">{value}</span>
      <span className="text-white text-xl mt-2">{label}</span>
    </div>
  );
}

export default function StatsBar({ wpm, cpm, accuracy }: StatsBarProps) {
  return (
    <div className="flex gap-8 justify-center bg-[#07071a] py-8">
      <StatCircle value={wpm} label="words/min" />
      <StatCircle value={cpm} label="chars/min" />
      <StatCircle value={accuracy} label="% accuracy" />
    </div>
  );
}
