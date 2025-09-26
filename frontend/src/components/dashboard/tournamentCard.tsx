const TournamentCard = () => {
  return (
    <div className="h-1/2 p-2 overflow-hidden box-border">
      <div className="flex text-white  flex-col bg-compBg max-w-[253px] max-h-[264px] rounded-[30px] overflow-hidden">
        <img
          src="/src/assets/tournament_bg.jpeg"
          className="h-1/2 w-full object-cover"
        />
        <div className="pt-2 px-5">
          <h2 className="font-semibold text-[20px]">Test Tournament</h2>
          <p className="font-light text-[10px]">Jun 26 - Jun 27, 2020</p>
        </div>
        <div className="px-5 py-6 flex flex-col flex-1">
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
              <div className="flex">
                <img
                  className="rounded-full object-cover w-[20px] h-[20px]"
                  src="/profile1.jpg"
                  alt=""
                />
                <img
                  className="rounded-full object-cover w-[20px] h-[20px]"
                  src="/profile2.jpg"
                  alt=""
                />
                <img
                  className="rounded-full object-cover w-[20px] h-[20px]"
                  src="/profile3.jpg"
                  alt=""
                />
                <img
                  className="rounded-full object-cover w-[20px] h-[20px]"
                  src="/profile4.jpg"
                  alt=""
                />
              </div>

              {/* <p className="font-medium text-[12px] ml-1">12 Participants</p> */}
              <button className="font-bold bg-neon rounded-full p-1 px-3 text-[12px]">
                JOIN
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentCard;
