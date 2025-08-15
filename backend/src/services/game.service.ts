import { GameInfo } from "../models/game.js";

export const getGameState = () => {
  return GameInfo;
};

export const updateGameState = (updates: Partial<typeof GameInfo>) => {
  Object.assign(GameInfo, updates);
  return GameInfo;
};
