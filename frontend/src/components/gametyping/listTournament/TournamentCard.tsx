interface TournamentCardProps {
  name: string;
}

export default function TournamentCard({ name }: TournamentCardProps) {
  return (
    <div className="w-[260px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-[#2e1a7c] to-[#3d1e8f] flex flex-col">
      {/* Top image */}
      <div className="h-[120px] bg-[#00cfff] flex items-center justify-center">
        <img
          src="/table-tennis.png"
          alt="Tournament"
          className="h-[90px]"
        />
      </div>
      {/* Tournament name */}
      <div className="bg-[#4B1D8F] px-6 py-4">
        <h2 className="text-white text-xl font-bold mb-2">{name}</h2>
        {/* Avatars */}
        <div className="flex items-center mb-4">
          <img
            src="/table-tennis.png"
            className="w-8 h-8 rounded-full border-2 border-white -ml-2"
          />
          <img
            src="/table-tennis.png"
            className="w-8 h-8 rounded-full border-2 border-white -ml-2"
          />
          <img
            src="/table-tennis.png"
            className="w-8 h-8 rounded-full border-2 border-white -ml-2"
          />
          <span className="ml-2 text-white text-sm bg-[#6c3fdc] px-2 py-1 rounded-full">
            +99
          </span>
        </div>
        {/* Participants and Join button */}
        <div className="flex items-center justify-between">
          <span className="text-white text-sm font-semibold flex items-center">
            <svg className="w-4 h-4 mr-1" fill="white" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
            </svg>
            20 participants
          </span>
          <button className="bg-[#A259FF] text-white font-bold px-6 py-2 rounded-full shadow-lg transition hover:brightness-110">
            JOIN
          </button>
        </div>
      </div>
    </div>
  );
}
