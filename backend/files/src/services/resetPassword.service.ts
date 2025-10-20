import type { FastifyRequest, FastifyReply } from "fastify";
import type { LoginBody } from "../models/user.model.js";
import app from "../server.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const checkResetPass = async (req: FastifyRequest<{ Body: LoginBody }>, res: FastifyReply) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    //hash the incoming token
    const hashedToken: string = crypto.createHash("sha256").update(token).digest("hex");

    //check if user exists
    const user = app.db.prepare("SELECT * FROM players WHERE reset_token = ? AND reset_flag = ?").get(hashedToken, 1);

    //check if user requested a reset password or not
    if (!user || !user.reset_flag) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    //check expiration of password reset process
    if (Date.now() - user.reset_time > 300000) {
      return res.status(401).send({ error: "EXPIRED" });
    }

    res.status(200).send({ message: "Authorized" });
  } catch (error) {
    res.status(500).send({ error: "Error occurred in reset password checking" });
  }
};

export const resetPassword = async (req: FastifyRequest<{ Body: LoginBody }>, res: FastifyReply) => {
  try {
    const { email } = req.body;

    //check if email is provided
    if (!email) return res.status(401).send({ error: "Email should be provided" });

    const user = app.db.prepare("SELECT * from players WHERE email = ?").get(email);

    //check if user exists
    if (!user) {
      return res.status(401).send({ error: "Email is not linked to any account" });
    }

    const resetToken = crypto.randomBytes(32).toString("base64url");
    const hashedToken: string = crypto.createHash("sha256").update(resetToken).digest("hex");

    const urlReset = `https://${process.env.VITE_HOST}:${process.env.VITE_PORT}/reset-password/new?token=${resetToken}`;

    app.db.prepare("UPDATE players SET reset_flag = ?, reset_time = ?, reset_token = ? WHERE id = ?").run(1, Date.now(), hashedToken, user?.id);

    const mailOptions = {
      from: process.env.GMAIL_USERNAME,
      to: email,
      subject: "Reset Password",
      text: `here is the link to reset your password : ${urlReset}`,
    };

    app.mailer.sendMail(mailOptions, function (err: Error, info: any) {
      if (err) {
        return res.status(401).send({ error: "Error sending reset email" });
      } else {
        return res.status(200).send({ message: info.response });
      }
    });

    return res.status(200).send({ message: "Reset link sent to the user email successfully" });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

export const verifyResetPin = async (req: FastifyRequest<{ Body: LoginBody }>, res: FastifyReply) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    //check if password is provided
    if (!password || !confirmPassword) return res.status(401).send({ error: "Password or confirm password should be provided" });

    const resetToken: string = crypto.createHash("sha256").update(token).digest("hex");

    const user = app.db.prepare("SELECT * from players WHERE reset_token = ?").get(resetToken);

    //check if user exists
    if (!user) {
      return res.status(401).send({ error: "User not found" });
    }

    if (!user.reset_flag) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    //check password regex
    const passwordPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$");
    if (password.length < 8 || password.length > 30) {
      return res.status(401).send({
        error: "Password should be at least 8 characters including a lowercaser letter and a number",
      });
    }
    if (!passwordPattern.test(password)) {
      return res.status(401).send({ error: "Password not valid!" });
    }

    if (password != confirmPassword) {
      return res.status(401).send({ error: "Password is not matching the confirm Password!" });
    }

    const isMatch = await bcrypt.compare(password, user?.password);

    if (isMatch) {
      return res.status(401).send({
        error: "The password should be different from any password set before",
      });
    }

    const hashedPassword: string = await bcrypt.hash(password, 10);
    //set new password
    app.db.prepare("UPDATE players SET password = ?, reset_flag = ?, reset_token = ? WHERE id = ?").run(hashedPassword, 0, null, user?.id);

    return res.status(200).send({ message: "Reset password success" });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
