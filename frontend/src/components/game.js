import Bat1 from "./bat1";
import Bat2 from "./bat2";
import Ball from "./ball"

function Game () {
    return (
        <div className="h-screen bg-gameBg flex justify-center">
            <div className="flex justify-between items-center relative mt-52 w-[70%] h-[70%] border-2 border-neon rounded-2xl shadow-neon shadow-[0_0px_50px_rgba(0,0,0,0.3)] bg-black">
                <Bat1 />
                <Ball />
                <Bat2 />
            </div>
        </div>
    );
}


export default Game;