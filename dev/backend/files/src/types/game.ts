import type { GameInfo } from "../models/game.js";

export interface MessagePacket {
	to: string;
	game_info: GameInfo;
  }