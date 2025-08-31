import LeftBracket from "./LeftBracket";
import RightBracket from "./RightBracket";
// import ConnectorLeft from "./ConnectorLeft";;
// import ConnectorRight from "./ConnectorRight";

const users = [
  { username: "User1", avatarUrl: "https://via.placeholder.com/150" },
  { username: "User2", avatarUrl: "https://via.placeholder.com/150" },
  { username: "User3", avatarUrl: "https://via.placeholder.com/150" },
  { username: "User4", avatarUrl: "https://via.placeholder.com/150" },
  { username: "User5", avatarUrl: "https://via.placeholder.com/150" },
  // { username: "User6", avatarUrl: "https://via.placeholder.com/150" },
  // { username: "User7", avatarUrl: "https://via.placeholder.com/150" },
  // { username: "User8", avatarUrl: "https://via.placeholder.com/150" },
];

const winners = [
  { username: "Alice", avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg", score: 5 },
  { username: "Bob", avatarUrl: "https://randomuser.me/api/portraits/men/34.jpg", score: 4 },
];

export default function Tournament() {
  return (
    <div className="bg-[#0a0035] relative">
      <div className="absolute top-[40px] left-[600px]">
        <h1 className="font-poppins font-bold text-[70px] leading-[20px] tracking-[0.02em] uppercase text-white">
          test tournament
        </h1>
      </div>
      <div className="min-h-screen flex items-center justify-between px-12">
        <div >
          <LeftBracket users={users.slice(0, 2)} />
          <LeftBracket users={users.slice(2, 4)} />
          {/* <LeftBracket users={users.slice(0, 2)} />
          <LeftBracket users={users.slice(2, 4)} /> */}
          {/* <LeftBracket users={users.slice(0, 2)} />
          <LeftBracket users={users.slice(2, 4)} />
          <LeftBracket users={users.slice(0, 2)} />
          <LeftBracket users={users.slice(2, 4)} /> */}
          {/* <ConnectorLeft width={100} height={90} color="white" strokeWidth={2} /> */}
        </div>
        <div>
          <RightBracket users={users.slice(4, 6)} />
          <RightBracket users={users.slice(6, 8)} />
          {/* <RightBracket users={users.slice(4, 6)} />
          <RightBracket users={users.slice(6, 8)} /> */}
          {/* <RightBracket users={users.slice(4, 6)} />
          <RightBracket users={users.slice(6, 8)} />
          <RightBracket users={users.slice(4, 6)} />
          <RightBracket users={users.slice(6, 8)} /> */}
          {/* <ConnectorRight width={100} height={90} color="white" strokeWidth={2} /> */}
        </div>
      </div>
    </div>
  );
}
