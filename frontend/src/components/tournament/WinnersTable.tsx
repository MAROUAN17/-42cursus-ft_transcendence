import React from "react";

interface Winner {
  username: string;
  avatarUrl: string;
  score: number;
}

interface WinnersTableProps {
  winners: Winner[];
}

const WinnersTable: React.FC<WinnersTableProps> = ({ winners }) => (
  <div className="bg-white rounded-md shadow-md p-4 w-full max-w-md mx-auto">
    <h2 className="text-xl font-bold mb-4 text-center text-purple-700">Winners</h2>
    <table className="w-full text-left">
      <thead>
        <tr>
          <th className="py-2 px-4">Avatar</th>
          <th className="py-2 px-4">Username</th>
          <th className="py-2 px-4">Score</th>
        </tr>
      </thead>
      <tbody>
        {winners.map((winner) => (
          <tr key={winner.username} className="border-t">
            <td className="py-2 px-4">
              <img src={winner.avatarUrl} alt={winner.username} className="w-8 h-8 rounded-full border" />
            </td>
            <td className="py-2 px-4 font-semibold">{winner.username}</td>
            <td className="py-2 px-4">{winner.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default WinnersTable;
