
import PlayerBox from "./playerBox";
import { useParams } from "react-router";

const mockUsers = [
  { username: "USER1", avatar: "https://i.pravatar.cc/40?img=1" },
  { username: "USER2", avatar: "https://i.pravatar.cc/40?img=2" },
  { username: "USER3", avatar: "https://i.pravatar.cc/40?img=3" },
  { username: "USER4", avatar: "https://i.pravatar.cc/40?img=4" },
];

 const TournamentBracket: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    console.log("tournament idis :", id);
  return (
    <div className="bg-[#0a043c] text-white min-h-screen flex flex-col items-center justify-center gap-10">
        <h1>id is {id}</h1>
      <div className="flex gap-32 items-center">
        
        <div className="flex gap-12 items-center">
          <div className="relative flex flex-col gap-10">
            <PlayerBox {...mockUsers[0]} />
            <PlayerBox {...mockUsers[1]} />

            <div className="absolute left-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2 w-8 h-px bg-white"></div>
            <div className="absolute left-[calc(100%+0.5rem)] top-0 bottom-0 w-px bg-white mx-auto"></div>
          </div>

          <div className="flex flex-col items-start">
            <PlayerBox {...mockUsers[0]} />
          </div>
        </div>

        <div className="flex gap-12 items-center">
          <div className="flex flex-col items-start">
            <PlayerBox {...mockUsers[0]} />
          </div>

          <div className="relative flex flex-col gap-10">
            <PlayerBox {...mockUsers[0]} />
            <PlayerBox {...mockUsers[1]} />

            <div className="absolute right-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2 w-8 h-px bg-white"></div>
            <div className="absolute right-[calc(100%+0.5rem)] top-0 bottom-0 w-px bg-white mx-auto"></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TournamentBracket;

