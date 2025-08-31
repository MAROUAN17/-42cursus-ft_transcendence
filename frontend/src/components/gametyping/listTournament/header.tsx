export default function Header() {
  return (
    <header className="bg-gradient-to-b from-[#1e0a4f] to-[#0a0035] text-white p-8 w-full">
      <div className="max-w-6xl mx-auto">
    <div className="flex justify-center">
      <h1 className="text-5xl font-bold mb-8">GLOBAL TOURNAMENTS</h1>
    </div>
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="text-lg font-semibold">40 Available tournaments</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-[#4B1D8F] rounded-full px-6 py-3 w-[350px]">
              <svg
                className="w-6 h-6 text-white opacity-60 mr-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search for tournament"
                className="bg-transparent outline-none text-white placeholder-white w-full"
              />
            </div>
            <button
              className="flex items-center gap-2 bg-[#A259FF] text-white font-bold px-8 py-3 rounded-full shadow-lg transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#A259FF] focus:ring-offset-2"
              style={{ boxShadow: "0 0 16px 4px #A259FF" }}
            >
              CREATE
              <span className="text-2xl font-light">+</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
