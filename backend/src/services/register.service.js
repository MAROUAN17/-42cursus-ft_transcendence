import app from "../server.js";
import {} from "../models/user.js";
import bcrypt from "bcrypt";
export const registerUser = async (req, res) => {
    try {
        let user = {};
        const { username, email, password } = req.body;
        //check if username user exists
        user = app.db
            .prepare('SELECT * from players WHERE username = ?')
            .get(username);
        if (user)
            res.status(500).send({ error: "Username already exists" });
        //check if user email already exists
        user = app.db
            .prepare('SELECT * from players WHERE email = ?')
            .get(email);
        if (user) {
            return res.status(500).send({ error: "Email already exist!" });
        }
        //hashing the password
        const hash = await bcrypt.hash(password, 10);
        app.db
            .prepare('INSERT INTO players(username, email, password) VALUES (?, ?, ?)')
            .run(username, email, hash);
        res.status(200).send({ message: "Registered successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error });
    }
};
//# sourceMappingURL=register.service.js.map