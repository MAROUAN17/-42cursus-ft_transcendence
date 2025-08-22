import React from "react";
import Cart from "./Cart";

export default function Tournament() {
  return (
    <div className="bg-[#0a0035] min-h-screen flex items-center justify-between px-12">
      {/* Left Column */}
      <div className="flex flex-col gap-6 items-start">
        <Cart username="User1" avatarUrl="https://via.placeholder.com/150" />
        <Cart username="User2" avatarUrl="https://via.placeholder.com/150" />
        <Cart username="User3" avatarUrl="https://via.placeholder.com/150" />
        <Cart username="User4" avatarUrl="https://via.placeholder.com/150" />
      </div>

      {/* Right Column */}
      <div className="flex flex-col gap-6 items-end">
        <Cart username="User5" avatarUrl="https://via.placeholder.com/150" />
        <Cart username="User6" avatarUrl="https://via.placeholder.com/150" />
        <Cart username="User7" avatarUrl="https://via.placeholder.com/150" />
        <Cart username="User8" avatarUrl="https://via.placeholder.com/150" />
      </div>
    </div>
  );
}
