import type { FastifyRequest, FastifyReply } from "fastify";
import type { LoginBody } from "../models/user.model.js";
import app from "../server.js";
import bcrypt from "bcrypt";

export const checkResetPass = async (
  req: FastifyRequest<{ Body: LoginBody }>,
  res: FastifyReply
) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    //check if user exists
    const user = app.db
      .prepare("SELECT * FROM players WHERE id = ? AND reset_flag = ?")
      .get(id, 1);

    if (!user || !user.reset_flag) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    //check expiration of password reset process
    if (Date.now() - user.reset_time > 120000) {
      return res
        .status(401)
        .send({ message: "Password reset link already expired" });
    }

    res.status(200).send({ message: "Authorized" });
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

export const resetPassword = async (
  req: FastifyRequest<{ Body: LoginBody }>,
  res: FastifyReply
) => {
  try {
    const { email } = req.body;

    //check if email is provided
    if (!email)
      return res.status(401).send({ error: "Email should be provided" });

    const user = app.db
      .prepare("SELECT * from players WHERE email = ?")
      .get(email);

    //check if user exists
    if (!user) {
      return res
        .status(401)
        .send({ error: "Email is not linked to any account" });
    }

    app.db
      .prepare(
        "UPDATE players  SET reset_flag = ?, reset_time = ? WHERE email = ?"
      )
      .run(1, Date.now(), email);

    const pinCode = Math.floor(100000 + Math.random() * 900000);
    const urlReset = `https://localhost:3000/reset-password/new?id=${user.id}&token=${pinCode}`;

    const mailOptions = {
      from: process.env.GMAIL_USERNAME,
      to: email,
      subject: "Reset Password",
      text: `here is the link to reset your password : ${urlReset}`,
    };

    app.mailer.sendMail(mailOptions, function (err: Error, info: any) {
      if (err) {
        return res.status(401).send({ error: err });
      } else {
        return res.status(200).send({ message: info.response });
      }
    });

    return res.status(200).send({ message: pinCode });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

export const verifyResetPin = async (
  req: FastifyRequest<{ Body: LoginBody }>,
  res: FastifyReply
) => {
  try {
    const { id, password, confirmPassword } = req.body;

    if (!id) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    //check if password is provided
    if (!password || !confirmPassword)
      return res
        .status(401)
        .send({ error: "Password or confirm password should be provided" });

    const user = app.db.prepare("SELECT * from players WHERE id = ?").get(id);

    //check if user exists
    if (!user) {
      return res.status(401).send({ error: "User not found" });
    }

    if (!user.reset_flag) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    const passwordPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$");
    if (password.length < 8 || password.length > 30) {
      return res.status(401).send({
        error:
          "Password should be at least 8 characters including a lowercaser letter and a number",
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

    const hashedPass: string = await bcrypt.hash(password, 10);

    //set new password
    app.db
      .prepare("UPDATE players SET password = ? WHERE id = ?")
      .run(hashedPass, id);

    app.db
      .prepare("UPDATE players SET reset_flag = ? WHERE id = ?")
      .run(0, id);

    return res.status(200).send({ message: "Reset password success" });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
