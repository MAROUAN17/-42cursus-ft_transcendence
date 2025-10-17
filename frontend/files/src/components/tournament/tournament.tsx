
import { useState } from "react";

export default function Tournament() {
  const [name, setName] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const createTournament = async () => {
    try {
      const res = await fetch("https://localhost:5000/tournament/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "player-id": "123",
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      console.log("data:", data);
    } catch (err: any) {
      console.log("Error: " + err.message);
    }
  };

  return (
    <div className="">
      <div>
        <h1>Create Tournament</h1>

        <input type="text" placeholder="Tournament Name" value={name} onChange={(e) => setName(e.target.value)} />

        <button onClick={createTournament}>Submit</button>
      </div>
    </div>
  );
}
