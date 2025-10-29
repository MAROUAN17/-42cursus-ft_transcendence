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
//# sourceMappingURL=tournament.d.ts.map