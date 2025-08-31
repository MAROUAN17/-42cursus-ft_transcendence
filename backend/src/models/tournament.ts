// 8 / 4
export interface Tournament {
  id: string;
  name: string;
  date: string;
  players: Player[];
  winnerId?: string;
}

export interface Player {
  id: string;
  username: string;
  avatarUrl: string;
  score?: number;
}

export interface Match {
  id: string;
  player1Id: string;
  player2Id: string;
  score1?: number;
  score2?: number;
  winnerId?: string;
}
// const tournament: Tournament = {
//   id: "t1",
//   name: "Summer Cup",
//   date: "2025-08-24",
//   players: [
//     { id: "p1", username: "Alice", avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg", score: 5 },
//     { id: "p2", username: "Bob", avatarUrl: "https://randomuser.me/api/portraits/men/34.jpg", score: 4 }
//   ],
//   rounds: [
//     {
//       id: "r1",
//       matches: [
//         { id: "m1", player1Id: "p1", player2Id: "p2", score1: 3, score2: 2, winnerId: "p1" }
//       ]
//     }
//   ],
//   winnerId: "p1"
// };