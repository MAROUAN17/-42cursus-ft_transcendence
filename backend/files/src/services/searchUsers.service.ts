import type { FastifyReply, FastifyRequest } from "fastify";
import type { userSearch } from "../models/user.model.js";
import app from "../server.js";
import type { Payload } from "../models/chat.js";

function getMutualsCount(userFriends: string[], targetUserFriends: string[]): number {
  let count: number = 0;
  for (const friendId of userFriends) {
    if (targetUserFriends.includes(friendId)) count++;
  }
  return count;
}
function checkStatus(targetUserFriends: string, targetId: number, userId: number): "friend" | "sentReq" | "notFriend" {
  if (targetUserFriends.includes(JSON.stringify(userId))) return "friend";
  const notif = app.db
    .prepare("SELECT * from notifications WHERE recipient_id = ? AND sender_id = ? AND type = ?")
    .get(targetId, userId, "friendReq");
  if (notif) return "sentReq";
  else return "notFriend";
}

export const searchUsers = async (req: FastifyRequest<{ Querystring: { query: string } }>, res: FastifyReply) => {
  try {
    interface dbQuery {
      id: number;
      username: string;
      avatar: string;
      friends: string;
    }
    const token = req.cookies.accessToken!;
    const payload = app.jwt.jwt1.verify(token) as Payload;
    const userFriends: string = app.db.prepare("SELECT friends FROM players WHERE id = ?").get(payload.id).friends;
    const usersDB: dbQuery[] = app.db
      .prepare(
        "SELECT id, username, avatar, friends FROM players WHERE username LIKE '%' || ? || '%' AND id != ? AND NOT EXISTS (SELECT key FROM json_each(block_list) WHERE value = ?)"
      )
      .all(req.query.query, payload.id, JSON.stringify(payload.id)) as dbQuery[];
    const users: userSearch[] = usersDB.map((row: dbQuery) => ({
      id: row.id,
      username: row.username,
      avatar: row.avatar,
      friends: row.friends,
      mutualsCount: getMutualsCount(JSON.parse(userFriends), JSON.parse(row.friends)),
      status: checkStatus(row.friends, row.id, payload.id),
    }));
    res.status(200).send({ data: users });
  } catch (err) {
    console.log("error -> ", err);
    res.status(500).send({ error: err });
  }
};
