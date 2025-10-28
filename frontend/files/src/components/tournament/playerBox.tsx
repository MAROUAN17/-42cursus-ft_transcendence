import { useEffect, useState } from "react";
import axios from "axios";

interface UserBoxProps {
  id:number;
  username: string | undefined;
  avatar: string | undefined;
  tournamentId: number;
  roundNb: number;
}

const PlayerBox: React.FC<UserBoxProps> = ({ id, username, avatar, tournamentId,  roundNb }) => {

  const [score, setScore] = useState<number>(0)
  const fetchData = () => {
    console.log("entered");
    
    console.log("sent");
    api.post(
        `/tournament/score/${id}`,
        {
          tournamentId: tournamentId,
          roundNb:roundNb
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true
        },
      )
      .then  (function (res) {
        console.log("----- scoe",res.data);
        setScore(res.data.score);
      }).catch(function (err) {
        console.log(err);
      });
  };
  useEffect (() => {
    if (!id || !tournamentId || !roundNb)
        return ;
    console.log("ID : ", id, tournamentId, roundNb);
    console.log("avatar : ", avatar, 'username -> ', username);
    fetchData();
  }, [id, tournamentId, roundNb]);
  // console.log('helloooooo')

  return (
    <div className="font-poppins flex items-center">
      <div className="flex items-center gap-2 bg-neon text-white px-4 py-2 rounded-l-lg xl:w-[300px] lg:w-[150px]">
        <img
          src={avatar ? avatar : '/9896174.jpg'}
          alt={username ? username : 'no-pic'}
          className="w-[42px] h-[42px] rounded-full object-cover"
        />
        <span className="truncate text-sm font-bold uppercase">{username}</span>
      </div>

      <div className="w-8 h-8 bg-white text-purple-700 font-bold flex items-center justify-center rounded-sm ml-[2px]">
        {score}
      </div>
    </div>
  );
};

export default PlayerBox;
