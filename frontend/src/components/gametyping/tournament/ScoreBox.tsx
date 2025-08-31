import React from "react";

type ScoreBoxProps = {
  score?: string | number;
};

const ScoreBox: React.FC<ScoreBoxProps> = ({ score = "-" }) => (
  <div className="w-10 m-1 h-10 flex items-center justify-center bg-white text-black font-bold rounded-sm shadow-md">
    {score}
  </div>
);

export default ScoreBox;
