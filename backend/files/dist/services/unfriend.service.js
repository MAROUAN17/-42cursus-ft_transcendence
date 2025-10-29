import app from "../server.js";
export const unfriendUser = async (req, res) => {
    try {
        if (!req.params.id)
            return;
        const token = req.cookies.accessToken;
        const payload = app.jwt.jwt1.verify(token);
        //check if user exist && user is a friend
        const checkFriend1 = app.db
            .prepare("SELECT key FROM json_each((SELECT friends FROM players WHERE id = ?)) WHERE value = ?")
            .get(payload.id, req.params.id.toString());
        const checkFriend2 = app.db
            .prepare("SELECT key FROM json_each((SELECT friends FROM players WHERE id = ?)) WHERE value = ?")
            .get(req.params.id, payload.id.toString());
        if (checkFriend1 == undefined || checkFriend2 == undefined)
            return;
        const removedFriend = app.db
            .prepare("UPDATE players SET friends = json_remove(friends, '$[' || ? || ']') WHERE id = ?")
            .run(checkFriend1.key.toString(), payload.id);
        const removed = app.db
            .prepare("UPDATE players SET friends = json_remove(friends, '$[' || ? || ']') WHERE id = ?")
            .run(checkFriend2.key.toString(), req.params.id);
        if (removedFriend.changes == 0 || removed.changes == 0)
            return res.status(404).send({ error: "Error" });
        res.status(200).send();
    }
    catch (err) {
        res.status(500).send({ error: "Unkown Error" });
    }
};
//# sourceMappingURL=unfriend.service.js.map