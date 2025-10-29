import app from "../server.js";
import { error } from "console";
export const deleteNotification = async (req, res) => {
    try {
        const deletedRow = app.db.prepare("DELETE FROM notifications WHERE id = ?").run(req.params.id);
        if (deletedRow.changes == 0)
            return res.status(404).send({ error: "Notification Not Found!" });
        res.status(200).send();
    }
    catch (err) {
        res.status(500).send({ error: "Unkown Error" });
    }
};
//# sourceMappingURL=deleteNotification.service.js.map