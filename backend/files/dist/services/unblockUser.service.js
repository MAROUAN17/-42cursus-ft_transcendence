import app from "../server.js";
export const unblockUser = async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        const payload = app.jwt.jwt1.verify(token);
        const checkBlocked = app.db
            .prepare("SELECT key FROM json_each((SELECT block_list FROM players WHERE id = ?)) WHERE value = ?")
            .get(payload.id, req.params.id);
        if (checkBlocked == undefined)
            return;
        const blockedUser = app.db
            .prepare("UPDATE players SET block_list = json_remove(block_list, '$[' || ? || ']') WHERE id = ?")
            .run(checkBlocked.key.toString(), payload.id);
        if (blockedUser.changes == 0)
            return res.status(404).send({ error: "Error" });
        res.status(200).send();
    }
    catch (err) {
        res.status(500).send({ error: "Unkown Error" });
    }
};
//# sourceMappingURL=unblockUser.service.js.map