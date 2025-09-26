const TournamentCard = () => {
  return (
    <div className="h-1/2 p-2 overflow-hidden box-border">
      <div className="flex text-white  flex-col bg-compBg max-w-[250px] h-full rounded-[30px] overflow-hidden">
        <img src="/src/assets/tournament_bg.jpeg" className="h-1/2 w-full object-cove" />
        <div className="p-3 flex flex-col justify-between flex-1">
          <div>
            <h2 className="font-semibold text-[20px]">Test Tournament</h2>
            <p className="font-normal text-[10px]">Jun 26 - Jun 27, 2020</p>
          </div>
          <div className="flex flex-col gap-1">
            {/* <div className="flex">
              <div className="w-[20px] h-[20px] rounded-full">
                <img src="/src/assets/photo.png" className="w-[20px] h-[20px]" />
              </div>
              <div className="w-[20px] h-[20px] rounded-full overflow-hidden ml-[-8px]">
                <img src="/src/assets/photo2.png" className="w-[20px] h-[20px]" />
              </div>
              <div className="w-[20px] h-[20px] rounded-full overflow-hidden ml-[-8px]">
                <img src="/src/assets/photo.png" className="w-[20px] h-[20px]" />
              </div>
              <div className="w-[20px] h-[20px] rounded-full overflow-hidden flex justify-center text-center items-center ml-[-8px] bg-neon/70">
                <p className="text-[10px]">+2</p>
              </div>
              <p className="text-[12px] ml-1">Friends Participating</p>
            </div> */}
            <div className="flex justify-between items-center">
              <p className="font-medium text-[15px] ml-1">12 Participants</p>
              <button className="font-bold bg-neon rounded-full p-1 px-3">JOIN</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentCard;
