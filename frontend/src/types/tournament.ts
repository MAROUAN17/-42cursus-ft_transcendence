import type { ProfileUserInfo } from "./user";

export interface Tournament {
  id: number;
  name: string;
  players: ProfileUserInfo[];
  createdAt: string;
  status: "open" | "started" | "full";
  admin: number;
}
