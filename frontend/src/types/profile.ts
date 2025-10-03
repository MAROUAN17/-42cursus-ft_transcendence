export interface MatchHistory {
  id: number;
  player1: number;
  player2: number;
  player1_name: string;
  player2_name: string;
  scoreLeft: number;
  scoreRight: number;
  startedAt: string;
  winner: number;
  winner_name: string;
}
export interface ChartData {
  uv: number;
  pv: number;
}

export interface UserHistory {
  playerId: number;
  rooms: MatchHistory[];
}

export interface UserStats {
  playerId: number;
  matchesPlayed: number;
  winRatio: number;
  tournamentsWon: number;
  rank: number;
  friendsCount: number;
}
