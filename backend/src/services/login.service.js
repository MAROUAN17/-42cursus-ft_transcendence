import app from "../server.js";
import {} from "../models/user.js";
import bcrypt from "bcrypt";
export const loginUser = async (req, res) => {
    try {
        let user = {};
        let userPass = {};
        const { username, email, password } = req.body;
        //check username
        if (username) {
            user = app.db
                .prepare('SELECT * from players WHERE username = ?')
                .get(username);
            userPass = app.db
                .prepare('SELECT password from players WHERE username = ?')
                .get(username);
        }
        //check email
        if (email) {
            user = app.db
                .prepare('SELECT * from players WHERE email = ?')
                .get(email);
            userPass = app.db
                .prepare('SELECT password from players WHERE email = ?')
                .get(email);
        }
        const isMatch = await bcrypt.compare(password, userPass.password);
        if (!user || !isMatch) {
            return res.status(500).send({ error: "Wrong credentials" });
        }
        //verify JWT token
        const token = app.jwt.sign({ email, username });
        return res.status(200).send({ token: token, message: "Logged in" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ err });
    }
};
//# sourceMappingURL=login.service.js.map