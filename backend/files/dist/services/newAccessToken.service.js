import {} from "../models/user.model.js";
import app from "../server.js";
export const requestNewToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        await app.jwt.jwt2.verify(refreshToken);
        const infos = (await app.jwt.jwt2.verify(refreshToken));
        const accessOptions = {
            path: "/",
            secure: true,
            httpOnly: true,
            sameSite: "lax",
        };
        if (infos?.rememberMe)
            accessOptions.maxAge = 900;
        const newAccessToken = app.jwt.jwt1.sign({
            id: infos?.id,
            email: infos?.email,
            username: infos?.username,
            rememberMe: infos?.rememberMe,
        }, { expiresIn: "900s" });
        res.clearCookie("accessToken", {
            path: "/",
            secure: true,
            httpOnly: true,
            sameSite: "lax",
        });
        res.setCookie("accessToken", newAccessToken, accessOptions);
    }
    catch (error) {
        res.clearCookie("refreshToken", {
            path: "/",
            secure: true,
            httpOnly: true,
            sameSite: "lax",
        });
        res.status(401).send({ error: "REFRESH_EXPIRED" });
    }
};
//# sourceMappingURL=newAccessToken.service.js.map