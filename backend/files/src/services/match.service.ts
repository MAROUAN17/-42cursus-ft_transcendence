import type { FastifyReply, FastifyRequest } from "fastify";
import { v4 as uuidv4 } from 'uuid';
import { DefaultGame, type GameInfo } from "../models/game.js";
import type {Player, Game} from "../models/game.js"
const waitingPlayers: Player[] = [];
export const activeGames: Game[] = [];




export const pair_players = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const playerId = req.headers['player-id'] as string ;
    const player: Player = {
      id: playerId,
      joinedAt: new Date(),
      username: req.body?.username,
    };

    const existingPlayerIndex = waitingPlayers.findIndex(p => p.id === player.id);
    if (existingPlayerIndex !== -1) {
      return res.status(400).send({
        error: "Player is already in the waiting queue",
        position: existingPlayerIndex + 1
      });
    }

    waitingPlayers.push(player);
    console.log(`Player ${player.id} joined the queue. Queue length: ${waitingPlayers.length}`);

    if (waitingPlayers.length >= 2) {
      const player1 = waitingPlayers.shift()!;
      const player2 = waitingPlayers.shift()!;
      
      const gameInfo: GameInfo = {
        ...DefaultGame,
        ball: {
          x: DefaultGame.bounds.width / 2,
          y: DefaultGame.bounds.height / 2,
          velX: (Math.random() > 0.5 ? 1 : -1) * 200,
          velY: (Math.random() > 0.5 ? 1 : -1) * 200
        }
      };

      const game: Game = {
        id: uuidv4(),
        player1,
        player2,
        status: 'active',
        createdAt: new Date(),
        gameInfo
      };

      activeGames.push(game);
      console.log(`Game created: ${game.id} with players ${player1.id} and ${player2.id}`);

      if (player.id === player1.id || player.id === player2.id) {
        return res.status(200).send({
          status: 'paired',
          message: 'Game found!',
          redirect: '/remote_game',
          game: {
            id: game.id,
            opponent: player.id === player1.id ? player2 : player1,
            side : player.id === player1.id ? "left" : "right",
            you: player.id === player1.id ? player1 : player2,
            gameInfo: game.gameInfo
          }
        });
      }
    }

    res.status(200).send({
      status: 'waiting',
      message: 'Waiting for opponent...',
      position: waitingPlayers.length,
      playerId: player.id
    });
  } catch (err) {
    console.error('Pairing error:', err);
    res.status(500).send({ error: err });
  }
};

export const get_queue_status = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    res.status(200).send({
      waitingPlayers: waitingPlayers.length,
      activeGames: activeGames.length,
      queue: waitingPlayers.map(p => ({
        id: p.id,
        waitTime: Date.now() - p.joinedAt.getTime()
      }))
    });
  } catch (err) {
    res.status(500).send({ error: err });
  }
};

export const leave_queue = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const playerId = req.headers['player-id'] as string;
    const playerIndex = waitingPlayers.findIndex(p => p.id === playerId);
    
    if (playerIndex !== -1) {
      waitingPlayers.splice(playerIndex, 1);
      console.log(`Player ${playerId} left the queue`);
      return res.status(200).send({ message: 'Left queue successfully' });
    }
    
    res.status(404).send({ error: 'Player not found in queue' });
  } catch (err) {
    res.status(500).send({ error: err });
  }
};

export const get_game = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const gameId = (req.params as any).gameId;
    const game = activeGames.find(g => g.id === gameId);
    
    if (!game) {
      return res.status(404).send({ error: 'Game not found' });
    }
    
    res.status(200).send({ game });
  } catch (err) {
    res.status(500).send({ error: err });
  }
};

export const get_player_game = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const playerId = (req.params as any).playerId;
    const game = activeGames.find(g => 
      g.player1.id === playerId || g.player2.id === playerId
    );
    
    if (!game) {
      return res.status(404).send({ error: 'No active game found for player' });
    }
    
    const playerRole = game.player1.id === playerId ? game.player1 : game.player2;
    const side = game.player1.id === playerId ? "left" : "right";
    const opponent = playerRole === game.player1 ? game.player2 : game.player1;
    
    res.status(200).send({ 
      game: {
        id: game.id,
        opponent,
        you: playerRole,
        side:side,
        gameInfo: game.gameInfo,
        status: game.status
      }
    });
  } catch (err) {
    res.status(500).send({ error: err });
  }
};

export const updateGameForId = (gameId: string, updates: Partial<GameInfo>) => {
  const game = activeGames.find(g => g.id === gameId);
  if (game) {
    Object.assign(game.gameInfo, updates);
    return game.gameInfo;
  }
  return null;
};

export const getGameStateById = (gameId: string) => {
  const game = activeGames.find(g => g.id === gameId);
  return game?.gameInfo || null;
};