import React from "react";
import CartLeft from "./CartLeft";
import CartRight from "./CartRight";

const users = [
  { username: "User1", avatarUrl: "https://via.placeholder.com/150" },
  { username: "User2", avatarUrl: "https://via.placeholder.com/150" },
  { username: "User3", avatarUrl: "https://via.placeholder.com/150" },
  { username: "User4", avatarUrl: "https://via.placeholder.com/150" }
];

export default function Tournament() {
  return (
    <div className="bg-[#0a0035] min-h-screen flex items-center justify-between px-12">
      {/* Left Column */}
      <div className="flex flex-col gap-6 items-start">

        {users.map(user => (
      <CartLeft key={user.username} username={user.username} avatarUrl={user.avatarUrl} />
    ))}
      </div>
      
      {/* Right Column */}
      <div className="flex flex-col gap-6 items-end">
        {users.map(user => (
      <CartRight key={user.username} username={user.username} avatarUrl={user.avatarUrl} />
    ))}
      </div>
    </div>
  );
}
