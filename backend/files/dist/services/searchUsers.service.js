import app from "../server.js";
function getMutualsCount(userFriends, targetUserFriends) {
    let count = 0;
    for (const friendId of userFriends) {
        if (targetUserFriends.includes(friendId))
            count++;
    }
    return count;
}
function checkStatus(targetUserFriends, targetId, userId) {
    if (targetUserFriends.includes(JSON.stringify(userId)))
        return "friend";
    const notif = app.db
        .prepare("SELECT * from notifications WHERE recipient_id = ? AND sender_id = ? AND type = ?")
        .get(targetId, userId, "friendReq");
    if (notif)
        return "sentReq";
    else
        return "notFriend";
}
export const searchUsers = async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        const payload = app.jwt.jwt1.verify(token);
        const userFriends = app.db.prepare("SELECT friends FROM players WHERE id = ?").get(payload.id).friends;
        const usersDB = app.db
            .prepare("SELECT id, username, avatar, friends FROM players WHERE username LIKE '%' || ? || '%' AND id != ? AND NOT EXISTS (SELECT key FROM json_each(block_list) WHERE value = ?)")
            .all(req.query.query, payload.id, JSON.stringify(payload.id));
        const users = usersDB.map((row) => ({
            id: row.id,
            username: row.username,
            avatar: row.avatar,
            friends: row.friends,
            mutualsCount: getMutualsCount(JSON.parse(userFriends), JSON.parse(row.friends)),
            status: checkStatus(row.friends, row.id, payload.id),
        }));
        res.status(200).send({ data: users });
    }
    catch (err) {
        res.status(500).send({ error: "Unkown Error" });
    }
};
//# sourceMappingURL=searchUsers.service.js.map