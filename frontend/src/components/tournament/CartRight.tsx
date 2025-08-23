import React from "react";

type UserMatchCardProps = {
  username: string;
  avatarUrl: string;
  score?: string | number; // default "-" if not provided
};

const CardRight: React.FC<UserMatchCardProps> = ({ username, avatarUrl, score = "-" }) => {
  return (
    <div className="flex items-center bg-transparent gap-2">
      <div className="w-10 h-10 flex items-center justify-center bg-white text-black font-bold rounded-sm shadow-md">
        {score}
      </div>
      <div className="flex items-center justify-between bg-purple-600 text-white px-4 py-3 rounded-md shadow-md w-[220px]">
        <span className="font-bold uppercase">{username}</span>
        <img
        //   src={avatarUrl}
        //   alt={username}
          className="w-10 h-10 rounded-full border-2 border-white"
        />
      </div>
      {/* <CartConnector /> */}
    </div>
  );
};

export default CardRight;
