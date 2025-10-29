// import type {User} from "../models/user.js"
import app from "../server.js";
export const getNotifications = async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        try {
            var payload = app.jwt.jwt1.verify(token);
        }
        catch (error) {
            res.status(401).send({ error: "JWT_EXPIRED" });
            return;
        }
        const userId = payload.id;
        const notifications = app.db
            .prepare("SELECT notifications.*, players.username, players.avatar FROM notifications JOIN players ON notifications.sender_id = players.id WHERE notifications.recipient_id = ? ORDER BY notifications.updatedAt DESC")
            .all(userId)
            .map((row) => ({
            id: row.id,
            type: row.type,
            username: row.username || "Deleted User",
            avatar: row.avatar,
            recipient_id: row.recipient_id,
            sender_id: row.sender_id,
            message: row.message,
            isRead: row.isRead,
            createdAt: row.updatedAt,
            unreadCount: row.unreadCount,
        }));
        res.status(200).send({ data: notifications });
    }
    catch (err) {
        res.status(500).send({ error: "Unkown Error" });
    }
};
//# sourceMappingURL=getNotifications.service.js.map