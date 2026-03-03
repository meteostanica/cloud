import { Database } from "bun:sqlite";
const authDB = new Database("./data/auth.sqlite");

authDB.run(`create table if not exists verifications (
    email text not null primary key,
    token text not null,
    code integer not null,
    timestamp datetime default current_timestamp
);`)

authDB.run(`create table if not exists users (
    email text not null primary key,
    name text,
    timestamp datetime default current_timestamp
);`)

authDB.run(`create table if not exists sessions (
    id text not null primary key,
    secretHash text not null,
    email text not null,
    timestamp datetime default current_timestamp
);`)

import nodemailer from "nodemailer"
import generateSecureRandomString from "./generateSecureRandomString";
import generateSecureCode from "./generateSecureCode";
import hashSecret from "./hashSecret";
import Meteostanice from "./meteostanice";

const transporter = nodemailer.createTransport({
  host: process.env.AUTH_EMAIL_SMTP_HOSTNAME,
  port: process.env.AUTH_EMAIL_SMTP_PORT,
  secure: true, // Use true for port 465, false for port 587
  auth: {
    user: process.env.AUTH_EMAIL_SMTP_USERNAME,
    pass: process.env.AUTH_EMAIL_SMTP_PASSWORD,
  },
});

export default class Auth {
    static addVerification(email) {
        const token = generateSecureRandomString()
        const code = generateSecureCode()

        authDB.prepare(`
            INSERT INTO verifications (email, token, code) 
            VALUES (?, ?, ?)
            ON CONFLICT(email) DO UPDATE SET
                token = excluded.token,
                code = excluded.code;
        `).run(email, token, code)

        return { email, token, code }
    }

    static async sendVerification(email, subject, text, html) {
        return await transporter.sendMail({
            from: process.env.AUTH_EMAIL_SMTP_FROM,
            to: email,
            subject,
            text, // Plain-text version of the message
            html, // HTML version of the message
        });
    }

    static getVerification(token) {
        const statement = authDB.prepare(`
            SELECT *, 
            ( CASE
                WHEN (strftime('%s', 'now') - strftime('%s', timestamp)) > $seconds THEN 0
                ELSE 1
                END
            ) AS valid
            FROM verifications 
            WHERE token = $token;
        `)

        const result = statement.get({
            $seconds: process.env.EMAIL_VERIFICATION_TIMEOUT,
            $token: token
        });

        return result;
    }

    static removeVerification(token) {
        authDB.prepare(`
            DELETE
            FROM verifications 
            WHERE token = ?;
        `).run(token)
    }

    static removeUserVerifications(email) {
        authDB.prepare(`
            DELETE
            FROM verifications 
            WHERE email = ?;
        `).run(email)
    }

    static addUser(email) {
        const statement = authDB.prepare("INSERT INTO users (email) VALUES (?);")

        statement.run(
            email
        );

        return { email };
    }

    static getUser(email) {
        const statement = authDB.prepare("select * from users where email = ?;")

        const result = statement.get(
            email
        );

        return result;
    }

    static editUser(email, newName, newEmail) {
        const statement = authDB.prepare("select * from users where email = ?;")

        const user = statement.get(
            email
        );

        if (!user) return null

        const result = authDB.prepare(`
            update users
            set name = ?,
            email = ?
            where email = ?;
        `).run(newName, newEmail, email)

        Meteostanice.editOwnerOnOwned(email, newEmail)

        return result
    }

    static deleteUser(email) {
        Meteostanice.deleteOwned(email)

        this.removeUserSessions(email)
        this.removeUserVerifications(email)

        authDB.prepare(`
            DELETE
            FROM users 
            WHERE email = ?;
        `).run(email)
    }

    static async createSession(email) {
        const id = generateSecureRandomString();
        const secret = generateSecureRandomString();
        const secretHash = await hashSecret(secret);

        const token = id + "." + secret;

        const statement = authDB.prepare("INSERT INTO sessions (id, secretHash, email) VALUES (?, ?, ?);")

        statement.run(
            id,
            secretHash,
            email
        );

        return { id, secretHash, token, email };
    }

    static async getSession(token) {
        if (!token) return null

        const [id, secret] = token.split(".")

        const statement = authDB.prepare(`
            SELECT *, 
            ( CASE
                WHEN (strftime('%s', 'now') - strftime('%s', timestamp)) > $seconds THEN 0
                ELSE 1
                END
            ) AS valid
            FROM sessions 
            WHERE id = $id AND secretHash = $secretHash;
        `)

        const result = statement.get({
            $seconds: process.env.SESSION_TIMEOUT,
            $id: id,
            $secretHash: await hashSecret(secret)
        });

        return result
    }

    static removeSession(id) {
        authDB.prepare(`
            DELETE
            FROM sessions 
            WHERE id = ?;
        `).run(id)
    }

    static removeUserSessions(email) {
        authDB.prepare(`
            DELETE
            FROM sessions 
            WHERE email = ?;
        `).run(email)
    }
}