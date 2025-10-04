import type { PublicUserInfos } from "./user";

export interface Tournament {
  id: number;
  name: string;
  players: PublicUserInfos[];
  createdAt: string;
  status: "open" | "started" | "full";
  admin: number;
}
