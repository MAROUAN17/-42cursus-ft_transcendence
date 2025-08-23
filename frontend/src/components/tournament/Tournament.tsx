import React from "react";
import CartLeft from "./CartLeft";
import CartRight from "./CartRight";
import CartConnectorLeft from "./CartConnectorLeft";
import CartConnectorRight from "./CartConnectorRight";
import ConnectorLeft from "./CartConnectorLeft";

const users = [
  { username: "User1", avatarUrl: "https://via.placeholder.com/150" },
  { username: "User2", avatarUrl: "https://via.placeholder.com/150" },
  // { username: "User3", avatarUrl: "https://via.placeholder.com/150" },
  // { username: "User4", avatarUrl: "https://via.placeholder.com/150" }
];

export default function Tournament() {
  return (
    <div className="bg-[#0a0035] relative">
      <div className="absolute top-[90px] left-[400px]">
        <h1 className="font-poppins font-bold text-[70px] leading-[20px] tracking-[0.02em] uppercase text-white">
          test tournament
        </h1>
      </div>
      <div className=" min-h-screen flex items-center justify-between px-12">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-6 items-start">
            {users.map((user) => (
              <CartLeft
                key={user.username}
                username={user.username}
                avatarUrl={user.avatarUrl}
              />
            ))}
          </div>
          <div className="flex justify-center items-center min-h-screen bg-[#0a0035]">
            <ConnectorLeft width={100} height={90} color="white" strokeWidth={3} />
          </div>
          <CartLeft
            key={"wain"}
            username={"wain"}
            avatarUrl={"https://via.placeholder.com/150"}
          />
        </div>
        <div className="flex items-center justify-between">
          <CartRight
            key={"wain"}
            username={"wain"}
            avatarUrl={"https://via.placeholder.com/150"}
          />
          <CartConnectorRight />
          <div className="flex flex-col gap-6 items-end">
            {users.map((user) => (
              <CartRight
                key={user.username}
                username={user.username}
                avatarUrl={user.avatarUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
