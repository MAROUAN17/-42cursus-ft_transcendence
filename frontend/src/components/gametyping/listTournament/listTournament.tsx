import Header  from "./header";
const Tournament = [
  { name: "Test Tournament" },
  { name: "Summer Cup" },
  { name: "Winter League" },
  { name: "Champions Bracket" },
  { name: "Open Series" },
];

export default function listTournament() {
  return (
    <div>
      <Header />
      {/* You can map Tournament array here to show cards */}
    </div>
  );
}