import React, { useState } from "react";
import { Outlet } from "react-router";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

function Layout() {
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [ballColor, setBallColor] = useState("#B13BFF");
  const [ballShadow, setBallShadow] = useState("#B13BFF");
  const [paddleColor, setPaddleColor] = useState("#ffffff");
  const [paddleBorder, setPaddleBorder] = useState("#B13BFF");
  const [paddleShadow, setPaddleShadow] = useState("#B13BFF");
  const [paddleSpeed, setPaddleSpeed] = useState("2");

  return (
    <>
      {settingsOpen ? (
        <div className="absolute p-6 font-poppins flex flex-col justify-center items-center text-white rounded-[20px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-[#14095c] w-1/3 h-1/2">
          <div className="h-full w-full">
            <h1 className="font-bold text-[25px] mb-2">Game Customizations</h1>
            <hr />
            <div className="py-5">
              <div className="font-bold flex items-center text-[18px] mb-2">
                <h2 className="w-[115px]">Ball Color:</h2>
                <hr className="w-full" />
              </div>
              <div className="flex items-center gap-5">
                <div className="flex flex-col gap-3">
                  <h2>Ball's Color: </h2>
                  <h2>Ball's Shadow Color: </h2>
                </div>
                <div className="flex flex-col ml-16 gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={ballColor}
                      onChange={(e) => {
                        setBallColor(e.target.value);
                      }}
                      className="rounded-sm overflow-hidden border-4 bg-white"
                    />
                    <h2>{ballColor}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={ballShadow}
                      onChange={(e) => {
                        setBallShadow(e.target.value);
                      }}
                      className="rounded-sm overflow-hidden border-4 bg-white"
                    />
                    <h2>{ballShadow}</h2>
                  </div>
                </div>
                <div
                  className={`w-[40px] h-[40px] ml-16 rounded-full bg-[var(--ball-color)] shadow-[0_0px_15px_var(--ball-shadow)]`}
                  style={{ "--ball-color": ballColor, "--ball-shadow": ballShadow } as React.CSSProperties}
                ></div>
              </div>
              <div className="font-bold flex items-center text-[18px] my-2">
                <h2 className="w-[160px]">Paddle Color:</h2>
                <hr className="w-full" />
              </div>
              <div className="flex items-center gap-5">
                <div className="flex flex-col gap-3">
                  <h2>Paddle's Color: </h2>
                  <h2>Paddle's Border: </h2>
                  <h2>Paddle's Shadow Color: </h2>
                </div>
                <div className="flex flex-col ml-16 gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={paddleColor}
                      onChange={(e) => {
                        setPaddleColor(e.target.value);
                      }}
                      className="rounded-sm overflow-hidden border-4 bg-white"
                    />
                    <h2>{paddleColor}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={paddleBorder}
                      onChange={(e) => {
                        setPaddleBorder(e.target.value);
                      }}
                      className="rounded-sm overflow-hidden border-4 bg-white"
                    />
                    <h2>{paddleBorder}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={paddleShadow}
                      onChange={(e) => {
                        setPaddleShadow(e.target.value);
                      }}
                      className="rounded-sm overflow-hidden border-4 bg-white"
                    />
                    <h2>{paddleShadow}</h2>
                  </div>
                </div>
                <div
                  className="w-[18px] h-[65px] ml-20 border-4 border-[var(--paddle-border)] rounded-xl shadow-[0_0px_15px_var(--paddle-shadow)] bg-[var(--paddle-color)]"
                  style={{ "--paddle-color": paddleColor, "--paddle-border": paddleBorder, "--paddle-shadow": paddleShadow } as React.CSSProperties}
                ></div>
              </div>
              <div className="font-bold flex items-center text-[18px] my-2">
                <h2 className="w-[160px]">Paddle Speed:</h2>
                <hr className="w-full" />
              </div>
              <div className="flex gap-6">
                <h2>
                  Current Speed: <span></span>
                  {paddleSpeed}
                </h2>
                <input
                  type="range"
                  value={paddleSpeed}
                  onChange={(e) => setPaddleSpeed(e.target.value)}
                  min={1}
                  max={6}
                  className="accent-neon w-[380px] ml-16"
                />
              </div>
            </div>
          </div>
          <button onClick={() => setSettingsOpen(false)} className="bg-neon px-10 py-1 text-[20px] font-bold rounded-md">
            Back
          </button>
        </div>
      ) : null}
      <div className={`flex flex-col bg-darkBg h-screen ${settingsOpen ? "blur-sm shadow-[0_0_20px] pointer-events-none" : ""}`}>
        <Navbar />
        <div className="flex flex-row h-screen">
          <Sidebar setSettingsOpen={setSettingsOpen} />
          <Outlet />
        </div>
      </div>
    </>
  );
}
export default Layout;
