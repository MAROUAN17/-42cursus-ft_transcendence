import app from "../server.js";
export const getUsers = async (req, res) => {
    try {
        const users = app.db
            .prepare("SELECT * FROM players")
            .all();
        res.status(200).send({ data: users });
    }
    catch (err) {
        res.status(500).send({ error: err });
    }
};
//# sourceMappingURL=getUsers.service.js.map