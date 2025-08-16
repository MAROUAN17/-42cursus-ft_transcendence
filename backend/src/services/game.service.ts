// services/game.service.ts
import { GameInfo } from "../models/game.js";

export const getGameState = () => {
  return GameInfo;
};

export const updateGameState = (updates: Partial<typeof GameInfo>) => {
  Object.assign(GameInfo, updates);
  return GameInfo;
};

export const moveBall = () => {
  GameInfo.ball.x += 2;
  return GameInfo;
};
