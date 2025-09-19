export default function HistoryCard() {
  return (
    <div className="bg-compBg/20 px-12 py-5 text-white flex justify-between items-center">
      <div className="flex justify-center space-x-3 w-[200px]">
        <div>
          <img src="/photo.png" alt="" width="40px" height="40px" />
        </div>
        <div className="">
          <h1 className="font-bold">Player1</h1>
          <p className="text-sm font-light">Player player</p>
        </div>
      </div>
      <div className="flex justify-center w-[200px]">
        <h1 className="font-bold">Player vs Player</h1>
      </div>
      <div className="flex justify-center w-[200px]">
        <div className="border bg-[#05C168]/20 text-[#14CA74] font-medium border-[#14CA74]/50 px-3 py-2 rounded-lg">
          <h1 className="font-bold">Win</h1>
        </div>
      </div>
      <div className="flex justify-center w-[200px]">
        <h1 className="font-bold">30 - 11</h1>
      </div>
      <div className="flex justify-center w-[200px]">
        <h1 className="font-bold">08/05/2025 03:05:15</h1>
      </div>
    </div>
  );
}
