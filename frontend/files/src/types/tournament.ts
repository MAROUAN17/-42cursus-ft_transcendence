import type { UserInfos } from "./user";

export interface Tournament {
  id: number;
  name: string;
  players: UserInfos[];
  createdAt: string;
  status: "open" | "started" | "full";
  admin: number;
}
