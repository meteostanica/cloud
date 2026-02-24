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
            from: '"auth — meteostanica" <auth@meteostanica.com>',
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
            WHERE id = $id;
        `).run(id)
    }
}

function generateSecureCode() {
    // Generate a random 32-bit unsigned integer
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);

    // Use modulo to get a value within 1,000,000
    // Then pad with leading zeros if you want 000000-999999
    // Or adjust the math if you strictly want 100,000-999,999
    const number = array[0] % 1000000;

    return number.toString().padStart(6, '0');
}

function generateSecureRandomString() {
    // Human readable alphabet (a-z, 0-9 without l, o, 0, 1 to avoid confusion)
    const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";

    // Generate 24 bytes = 192 bits of entropy.
    // We're only going to use 5 bits per byte so the total entropy will be 192 * 5 / 8 = 120 bits
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);

    let id = "";

    for (let i = 0; i < bytes.length; i++) {
        // >> 3 "removes" the right-most 3 bits of the byte
        id += alphabet[bytes[i] >> 3];
    }

    return id;
}

async function hashSecret(secret) {
    const secretBytes = new TextEncoder().encode(secret);
    const secretHashBuffer = await crypto.subtle.digest("SHA-256", secretBytes);
    return new Uint8Array(secretHashBuffer);
}