import nodemailer from "nodemailer"
import app, { vaultClient } from "../server.js";
import fp from "fastify-plugin";

export const mailTransporter = fp(async function(fastify, opts) {
    const nodemailerSecrets = await vaultClient.read("/secret/nodemailer");
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: nodemailerSecrets.data.GMAIL_USERNAME,
            pass: nodemailerSecrets.data.GMAIL_PASS,
        }
    })

    app.decorate('mailer', transporter);
})