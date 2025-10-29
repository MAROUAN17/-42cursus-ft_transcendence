// import type {User} from "../models/user.js"
import app from "../server.js";
export const getMessages = async (req, res) => {
    try {
        const targetUser = req.params.user;
        const token = req.cookies.accessToken;
        try {
            var payload = app.jwt.jwt1.verify(token);
        }
        catch (error) {
            res.status(401).send({ error: "JWT_EXPIRED" });
            return;
        }
        const userId = payload.id;
        const query = app.db
            .prepare("SELECT * FROM messages WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?) ORDER BY createdAt DESC")
            .all(userId, targetUser, targetUser, userId);
        const messages = query.map((row) => ({
            id: row.id,
            sender_id: row.sender_id,
            type: row.type,
            isDelivered: true,
            isAccepted: row.isAccepted,
            recipient_id: row.recipient_id,
            message: row.message,
            isRead: row.isRead,
            createdAt: row.createdAt,
        }));
        res.status(200).send({ data: messages });
    }
    catch (err) {
        res.status(500).send({ error: "Unkown Error" });
    }
};
//# sourceMappingURL=getMessages.service.js.map