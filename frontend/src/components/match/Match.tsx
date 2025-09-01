//import { Button } from "@/components/ui/button"
import im1 from "./imgs/user1.png"

export default function MatchmakingInterface() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-16 tracking-wider">MATCHMAKING</h1>

      <div className="flex items-center justify-center gap-8 md:gap-16 mb-16">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={im1}
              alt="Player 1"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-purple-400 object-cover"
            />
            <div className="absolute -top-2 -right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              player1
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-purple-400 bg-indigo-900 flex items-center justify-center">
            <span className="text-white text-4xl md:text-5xl font-bold">VS</span>
          </div>
          <div className="absolute top-1/2 -left-16 md:-left-24 w-12 md:w-20 h-1 bg-purple-400 transform -translate-y-1/2"></div>
          <div className="absolute top-1/2 -right-16 md:-right-24 w-12 md:w-20 h-1 bg-purple-400 transform -translate-y-1/2"></div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-purple-400 bg-purple-500 flex items-center justify-center">
            <span className="text-white text-3xl md:text-4xl font-bold">?</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-8 rounded-full text-lg transition-colors"
        //  size="lg"
        >
          PLAY GAME
        </button>
        <button
        //  variant="outline"
          className="bg-white hover:bg-gray-100 text-purple-600 border-2 border-white font-semibold py-3 px-8 rounded-full text-lg transition-colors"
        //  size="lg"
        >
          BACK
        </button>
      </div>
    </div>
  )
}