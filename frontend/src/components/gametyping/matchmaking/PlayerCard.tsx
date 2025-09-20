interface PlayerCardProps {
  avatarUrl?: string;
  name: string;
  gradientColor?: string; // e.g. "from-purple-500 to-purple-400"
  isWaiting?: boolean;
}

export default function PlayerCard({
  avatarUrl,
  name,
  gradientColor = "from-purple-500 to-purple-400",
  isWaiting = false,
}: PlayerCardProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`rounded-full border-4 border-purple-400 w-28 h-28 flex items-center justify-center overflow-hidden mb-2 ${
          isWaiting ? "bg-purple-500" : ""
        }`}
      >
        {isWaiting ? (
          <span className="text-white text-4xl font-bold">?</span>
        ) : (
          <img src={avatarUrl} alt={name} className="w-24 h-24 object-cover rounded-full" />
        )}
      </div>
      <span
        className={`bg-gradient-to-r ${gradientColor} px-6 py-2 rounded-full text-white font-bold text-lg mt-2`}
      >
        {name}
      </span>
    </div>
  );
}