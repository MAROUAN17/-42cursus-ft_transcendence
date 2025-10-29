import app from "../server.js";
import { pump } from "../server.js";
import fs, { access } from "fs";
import path from "path";
export const fetchUser = async (req, res) => {
    try {
        const accessToken = req.cookies.accessToken;
        const infos = app.jwt.jwt1.decode(accessToken);
        const user = app.db.prepare("SELECT * FROM players WHERE id = ?").get(infos?.id);
        if (!user)
            return;
        if (!user.avatar) {
            app.db.prepare("UPDATE players SET avatar = ? WHERE id = ?").run("/profile1.jpg", infos?.id);
        }
        res.status(200).send({ infos: user });
    }
    catch (error) {
        res.status(500).send({ error: "Unkown Error" });
    }
};
export const fetchProfileUser = async (req, res) => {
    try {
        const { username } = req.params;
        if (username === "Deleted User")
            return res.status(404).send({ error: "not found" });
        const accessToken = req.cookies.accessToken;
        const payload = app.jwt.jwt1.decode(accessToken);
        const user = app.db.prepare("SELECT * FROM players WHERE id = ?").get(payload?.id);
        if (!user)
            return res.status(404).send({ error: "USER NOT FOUND" });
        if (!username || username == user.username) {
            return res.status(200).send({ infos: user, profileType: "me", twoFAVerify: user?.secret_otp ? true : false });
        }
        if (username) {
            const user = app.db.prepare("SELECT * FROM players WHERE username = ?").get(username);
            if (!user)
                return res.status(404).send({ message: "User not found" });
            //check if the requested user blocked the current user
            const checkBlocked = app.db
                .prepare("SELECT key FROM json_each((SELECT block_list FROM players WHERE id = ?)) WHERE value = ?")
                .get(payload?.id, user.id.toString());
            if (checkBlocked) {
                return res.status(200).send({
                    message: "User1 Blocked User2",
                    infos: user,
                    profileType: "other",
                    friend: false,
                    friendNotif: false,
                });
            }
            //check if the requested user is a friend
            const checkFriend = app.db
                .prepare("SELECT key FROM json_each((SELECT friends FROM players WHERE id = ?)) WHERE value = ?")
                .get(payload?.id, user.id.toString());
            if (checkFriend)
                return res.status(200).send({
                    infos: user,
                    profileType: "other",
                    friend: true,
                    friendNotif: false,
                });
            //check if friend request already sent
            const checkNotif = app.db
                .prepare("SELECT * from notifications WHERE sender_id = ? AND recipient_id = ? AND type = ?")
                .get(payload?.id, user.id.toString(), "friendReq");
            if (checkNotif)
                return res.status(200).send({
                    infos: user,
                    profileType: "other",
                    friend: false,
                    friendNotif: true,
                });
            res.status(200).send({
                infos: user,
                profileType: "other",
                friend: false,
                friendNotif: false,
            });
        }
    }
    catch (error) {
        res.status(500).send({ error: "Unkown Error" });
    }
};
export const checkBlock = async (req, res) => {
    try {
        const { username } = req.params;
        const accessToken = req.cookies.accessToken;
        const payload = app.jwt.jwt1.decode(accessToken);
        if (username) {
            const user = app.db.prepare("SELECT * FROM players WHERE username = ?").get(username);
            if (user) {
                const checkBlocked = app.db
                    .prepare("SELECT key FROM json_each((SELECT block_list FROM players WHERE id = ?)) WHERE value = ?")
                    .get(user.id, payload?.id.toString());
                if (checkBlocked)
                    return res.status(404).send({ error: "User2 Blocked User1" });
                res.status(200).send({ message: "you can see user profile" });
            }
            else
                return res.status(404).send({ error: "User not found" });
        }
        return res.status(200);
    }
    catch (error) {
        res.status(500).send({ error: "Unkown Error" });
    }
};
export const checkUserLoginPageStatus = async (req, res) => {
    try {
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;
        if (accessToken || refreshToken) {
            return res.status(401).send({ error: "LOGGED_IN" });
        }
        res.status(200).send({ message: "NOT LOGGED_IN" });
    }
    catch (error) {
        res.status(500).send({ error: "Unkown Error" });
    }
};
export const checkUserLoginStatus = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            return res.status(200).send({ message: "LOGGED_IN" });
        }
        res
            .clearCookie("accessToken", {
            path: "/",
            secure: true,
            httpOnly: true,
            sameSite: "lax",
        })
            .clearCookie("refreshToken", {
            path: "/",
            secure: true,
            httpOnly: true,
            sameSite: "lax",
        });
        res.status(401).send({ error: "NOT LOGGED_IN" });
    }
    catch (error) {
        res.status(500).send({ error: "Unkown Error".data.error });
    }
};
export const checkUser2faStatus = async (req, res) => {
    try {
        const loginToken = req.cookies.loginToken;
        if (!loginToken) {
            return res.status(401).send({ error: "UNAUTHORIZED" });
        }
        res.status(200).send({ message: "AUTHORIZED" });
    }
    catch (error) {
        res.status(500).send({ error: "Unkown Error" });
    }
};
export const uploadProfilePicture = async (req, res) => {
    try {
        const accessToken = req.cookies.accessToken;
        const payload = app.jwt.jwt1.decode(accessToken);
        const defaultPics = ["/profile1.jpg", "/profile2.jpg", "/profile3.jpg", "/profile4.jpg", "/profile5.jpg", "/profile6.jpg"];
        const options = { limits: { filedSize: 1000000 } };
        const fileData = await req.file(options);
        if (!fileData)
            return res.status(200).send({ message: "no image found" });
        fileData?.file.on("limit", () => {
            return res.status(401).send({ error: "File max size reached 1MB" });
        });
        if (fileData?.mimetype != "image/png" && fileData?.mimetype != "image/jpg" && fileData?.mimetype != "image/jpeg") {
            return res.status(401).send({ error: "File format not supported!" });
        }
        const uploadDir = path.resolve("/app/uploads");
        const fileName = "/" + Date.now().toString() + "." + fileData?.mimetype.split("/")[1];
        const filePath = path.join(uploadDir, fileName);
        await pump(fileData?.file, fs.createWriteStream(filePath));
        const user = app.db.prepare("SELECT * FROM players WHERE id = ?").get(payload?.id);
        if (!user)
            return res.status(401).send({ error: "USER NOT FOUND" });
        const oldAvatar = user?.avatar;
        if (!defaultPics.includes(oldAvatar)) {
            fs.unlink("/app/uploads/" + oldAvatar, (err) => {
                if (err) {
                }
            });
        }
        app.db.prepare("UPDATE players SET avatar = ? WHERE id = ?").run(fileName, payload?.id);
        return res.status(200).send({ message: "files uploaded", avatar: fileName });
    }
    catch (err) {
        return res.status(500).send({ error: "Picture upload failed" });
    }
};
export const getUserInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const user = app.db.prepare("SELECT * FROM players WHERE id = ?").get(id);
        if (!user)
            return res.status(404).send({ error: "USER NOT FOUND" });
        res.status(200).send({ infos: user });
    }
    catch (error) {
        res.status(500).send({ error: "Unkown Error" });
    }
};
//# sourceMappingURL=user.service.js.map