// import { useState, useEffect } from "react";
import TypingBattleHeader from "./TypingBattleHeader";
import PlayerScoreCard from "./PlayerScoreCard";
import VsIcon from "./VSIcon";
import TypingPrompt from "./TypingPrompt";
import TimerCircle from "./TimerCircle";
import StatsBar from "./StatsBar";
// const PROMPT = "The quick brown fox jumps over the lazy dog.";

export default function GameTyping() {
//   const [userInput, setUserInput] = useState("");
//   const [timer, setTimer] = useState(60);
//   const [isRunning, setIsRunning] = useState(false);
//   const [wpm, setWpm] = useState(0);
//   const [accuracy, setAccuracy] = useState(100);

//   useEffect(() => {
//     if (isRunning && timer > 0) {
//       const interval = setInterval(() => setTimer((t) => t - 1), 1000);
//       return () => clearInterval(interval);
//     }
//     if (timer === 0) setIsRunning(false);
//   }, [isRunning, timer]);

//   useEffect(() => {
//     const words = userInput.trim().split(/\s+/).length;
//     const minutes = (60 - timer) / 60;
//     setWpm(minutes > 0 ? Math.round(words / minutes) : 0);

//     let correct = 0;
//     for (let i = 0; i < userInput.length; i++) {
//       if (userInput[i] === PROMPT[i]) correct++;
//     }
//     setAccuracy(
//       userInput.length ? Math.round((correct / userInput.length) * 100) : 100
//     );
//   }, [userInput, timer]);

//   function handleChange(e) {
//     if (!isRunning) setIsRunning(true);
//     setUserInput(e.target.value);
//   }

//   function handleRestart() {
//     setUserInput("");
//     setTimer(60);
//     setIsRunning(false);
//     setWpm(0);
//     setAccuracy(100);
//   }

//   function renderPrompt() {
//     return (
//       <span>
//         {PROMPT.split("").map((char, i) => {
//           let color = "";
//           if (userInput[i] == null) color = "";
//           else if (userInput[i] === char) color = "text-green-500";
//           else color = "text-red-500";
//           return (
//             <span key={i} className={color}>
//               {char}
//             </span>
//           );
//         })}
//       </span>
//     );
//   }

  return (
    // <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-500">
    //   <div className="bg-white rounded-2xl shadow-lg p-8 w-[350px] flex flex-col items-center">
    //     <h1 className="text-2xl font-bold mb-2 text-center">
    //       Test Your Typing Skills
    //     </h1>
    //     <p className="mb-4 text-gray-500 text-center">
    //       How fast and accurate can you type?
    //     </p>
    //     <div className="bg-gray-100 rounded-xl p-6 w-full mb-4">
    //       <div className="mb-4 text-lg font-mono">{renderPrompt()}</div>
    //       <input
    //         type="text"
    //         className="w-full p-3 rounded border text-lg"
    //         placeholder="Start typing here..."
    //         value={userInput}
    //         onChange={handleChange}
    //         disabled={!isRunning && timer === 0}
    //       />
    //       <div className="flex justify-between mt-4 text-sm text-gray-600">
    //         <span>⏰ Time: {timer}s</span>
    //         <span>⚡ WPM: {wpm}</span>
    //         <span>🕒 Accuracy: {accuracy}%</span>
    //       </div>
    //     </div>
    //     <button
    //       className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold mt-2"
    //       onClick={handleRestart}
    //     >
    //       Restart Game
    //     </button>
    //   </div>
    //   <p className="mt-8 text-white text-center">
    //     Created with <span className="text-red-400">❤️</span> to improve your
    //     typing speed.
    //   </p>
    // </div>
     <div className="min-h-screen bg-gradient-to-br from-[#0a0035] to-[#000000] flex flex-col items-center justify-center">
      <TypingBattleHeader />
       <div className="flex items-center justify-center gap-16 mt-8">
        <PlayerScoreCard score={120} avatarUrl="/player.png" />
        <VsIcon />
        <PlayerScoreCard score={98} avatarUrl="/player.png" />
      </div>
      <TypingPrompt prompt="Lorem Ipsum is simply dummy text of th" userInput={"aminei"} />
      <TimerCircle seconds={60} />
      <StatsBar wpm={12} cpm={60} accuracy={98} />
    </div>
  );
}
