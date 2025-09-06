interface TimerCircleProps {
  seconds: number;
  maxSeconds?: number; // default 60
}

export default function TimerCircle({ seconds, maxSeconds = 60 }: TimerCircleProps) {
  const percent = (seconds / maxSeconds) * 100;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percent / 100);

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg width="128" height="128" className="absolute top-0 left-0">
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="#ffe600"
          strokeWidth="5"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.5s linear" }}
        />
      </svg>
      <div className="bg-[#1a1a7c] rounded-full w-28 h-28 flex flex-col items-center justify-center z-10">
        <span className="text-white text-4xl font-bold">{seconds}</span>
        <span className="text-white text-lg opacity-70">seconds</span>
      </div>
    </div>
  );
}