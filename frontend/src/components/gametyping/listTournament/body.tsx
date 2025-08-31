import { useState } from "react";
import TournamentCard from "./TournamentCard";
import Header from "./header";

const tournaments = [
  { id: 1, name: "Test Tournament" },
  { id: 2, name: "Summer Cup" },
  { id: 3, name: "Ping Pong Masters" },
  { id: 1, name: "Test Tournament" },
  { id: 2, name: "Summer Cup" },
  { id: 3, name: "Ping Pong Masters" },
  { id: 1, name: "Test Tournament" },
  { id: 2, name: "Summer Cup" },
  { id: 3, name: "Ping Pong Masters" },
  { id: 1, name: "Test Tournament" },
  { id: 2, name: "Summer Cup" },
  { id: 3, name: "Ping Pong Masters" },
  { id: 1, name: "Test Tournament" },
  { id: 2, name: "Summer Cup" },
  { id: 3, name: "Ping Pong Masters" },
  { id: 1, name: "Test Tournament" },
  { id: 2, name: "Summer Cup" },
  { id: 3, name: "Ping Pong Masters" },
];

export default function Body() {
  const [search, setSearch] = useState("");
  const filtered = tournaments.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="bg-gradient-to-b from-[#0a0035] to-[#000000] min-h-screen w-full">
      <Header search={search} setSearch={setSearch} />
      <div className="max-w-6xl mx-auto ">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 justify-items-center py-10">
          {filtered.map((tournament, idx) => (
            <TournamentCard
              key={idx + tournament.name}
              name={tournament.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
