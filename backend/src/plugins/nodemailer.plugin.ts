import nodemailer from "nodemailer"
import app from "../server.js";
import fp from "fastify-plugin";

export const mailTransporter = fp(async function(fastify, opts) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.GMAIL_USERNAME!,
            pass: process.env.GMAIL_PASS!,
        }
    })

    app.decorate('mailer', transporter);
})