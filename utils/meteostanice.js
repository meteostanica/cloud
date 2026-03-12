import { Database } from "bun:sqlite";
import { nanoid } from 'nanoid'
import generateSecureRandomString from "./generateSecureRandomString";

const meteostaniceDB = new Database("./data/meteostanice.sqlite");

meteostaniceDB.run(`create table if not exists list (
    id text not null primary key,
    owner text not null,
    name text not null,
    description text,
    websocketKey text not null,
    subowners text,
    warnings text,
    timestamp datetime default current_timestamp
);`)

meteostaniceDB.run(`create table if not exists data (
    id text not null primary key,
    meteostanica text not null,
    timestamp datetime default current_timestamp,

    indoorTemp text not null,
    indoorPressure text not null,
    indoorHumidity text not null,

    outdoorConnected integer not null,
    outdoorTemp text not null,
    outdoorPressure text not null,
    outdoorHumidity text not null
);`)

meteostaniceDB.run(`create table if not exists public (
    id text not null primary key,
    name text not null,
    description text,
    timestamp datetime default current_timestamp,

    showOwner integer default 1,
    
    showIndoorTemp integer default 1,
    showIndoorPressure integer default 1,
    showIndoorHumidity integer default 1,

    showOutdoorConnected integer default 1,
    showOutdoorTemp integer default 1,
    showOutdoorPressure integer default 1,
    showOutdoorHumidity integer default 1
);`)

import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.WARNING_EMAIL_SMTP_HOSTNAME,
  port: process.env.WARNING_EMAIL_SMTP_PORT,
  secure: true, // Use true for port 465, false for port 587
  auth: {
    user: process.env.WARNING_EMAIL_SMTP_USERNAME,
    pass: process.env.WARNING_EMAIL_SMTP_PASSWORD,
  },
});

export default class Meteostanice {
    static add(owner, name, description) {
        const id = nanoid()
        const websocketKey = generateSecureRandomString()

        meteostaniceDB.prepare(`
            INSERT INTO list (id, owner, name, description, websocketKey) 
            VALUES (?, ?, ?, ?, ?);
        `).run(id, owner, name, description, websocketKey)
    }

    static get(owner, id) {
        const statement = meteostaniceDB.prepare(`
            SELECT *
            FROM list 
            WHERE id = $id 
            AND (
                owner = $owner 
                OR EXISTS (
                    SELECT 1 
                    FROM json_each(list.subowners) 
                    WHERE value = $owner
                )
            );
        `);

        const result = statement.get({
            $owner: owner,
            $id: id
        });

        return result
    }

    static getById(id) {
        const statement = meteostaniceDB.prepare(`
            SELECT *
            FROM list 
            WHERE id = $id
        `);

        const result = statement.get({
            $id: id
        });

        return result
    }

    static getWebsocket(key) {
        const statement = meteostaniceDB.prepare(`
            SELECT *
            FROM list 
            WHERE websocketKey = $key;
        `)

        const result = statement.get({
            $key: key
        });

        return result
    }

    static getOwned(owner) {
        const statement = meteostaniceDB.prepare(`
            SELECT *
            FROM list
            WHERE owner = $owner 
            OR EXISTS (
                SELECT * 
                FROM json_each(list.subowners) 
                WHERE value = $owner
            )
            ORDER BY timestamp DESC;
        `)

        const result = statement.all({
            $owner: owner
        });

        return result
    }

    static edit(id, newName, newDescription, newOwner, subowners) {
        let newSubowners = subowners ? subowners.split(',').map(s => s.trim()).filter(Boolean) : [];

        meteostaniceDB.prepare(`
            update list
            set name = ?,
            description = ?,
            owner = ?,
            subowners = json(?)
            where id = ?;
        `).run(newName, newDescription, newOwner, JSON.stringify(newSubowners), id)
    }

    static editOwnerOnOwned(owner, newOwner) {
        meteostaniceDB.prepare(`
            UPDATE list
            SET 
                -- Update the primary owner if it matches
                owner = CASE WHEN owner = $owner THEN $newOwner ELSE owner END,
                
                -- Update the subowners array if it contains the owner
                subowners = CASE 
                    WHEN EXISTS (SELECT 1 FROM json_each(subowners) WHERE value = $owner)
                    THEN (
                        SELECT json_group_array(
                            CASE WHEN value = $owner THEN $newOwner ELSE value END
                        )
                        FROM json_each(subowners)
                    )
                    ELSE subowners 
                END
            WHERE owner = $owner 
            OR EXISTS (SELECT 1 FROM json_each(subowners) WHERE value = $owner);
        `).run({
            $owner: owner,
            $newOwner: newOwner
        });
    }

    static delete(id) {
        meteostaniceDB.prepare(`
            DELETE
            FROM data 
            WHERE meteostanica = $id;
        `).run({
            $id: id
        });

        meteostaniceDB.prepare(`
            DELETE
            FROM public 
            WHERE id = $id;
        `).run({
            $id: id
        });

        meteostaniceDB.prepare(`
            DELETE
            FROM list 
            WHERE id = $id;
        `).run({
            $id: id
        });
    }

    static deleteOwned(owner) {
        const meteostanice = this.getOwned(owner)

        for (const meteostanica of meteostanice) {
            this.delete(meteostanica.owner, meteostanica.id)
        }
    }

    static postData(meteostanica, indoorTemp, indoorPressure, indoorHumidity, outdoorConnected, outdoorTemp, outdoorPressure, outdoorHumidity, timestamp) {
        const id = nanoid();

        // 1. Define base columns and values
        let columns = ['id', 'meteostanica', 'indoorTemp', 'indoorPressure', 'indoorHumidity', 'outdoorConnected', 'outdoorTemp', 'outdoorPressure', 'outdoorHumidity'];
        let placeholders = ['?', '?', '?', '?', '?', '?', '?', '?', '?'];
        let args = [id, meteostanica, indoorTemp, indoorPressure, indoorHumidity, outdoorConnected, outdoorTemp, outdoorPressure, outdoorHumidity];

        // 2. Conditionally add timestamp
        if (timestamp) {
            columns.push('timestamp');
            placeholders.push('?');
            args.push(timestamp);
        }

        const statement = meteostaniceDB.prepare(`
            INSERT INTO data (${columns.join(', ')}) 
            VALUES (${placeholders.join(', ')})
        `);
        
        statement.run(...args);
    }

    static getData(meteostanica) {
        const statement = meteostaniceDB.prepare(`
            SELECT *
            FROM data 
            WHERE meteostanica = $meteostanica
            ORDER BY timestamp DESC;
        `)

        const result = statement.all({
            $meteostanica: meteostanica
        });

        return result
    }

    static getDataProperty(meteostanica, property) {
        const tableNames = meteostaniceDB.prepare(`PRAGMA table_info('data');`).all()
        if (!tableNames.find(i => i.name === property)) return null

        const statement = meteostaniceDB.prepare(`
            SELECT ${property}
            FROM data
            WHERE meteostanica = $meteostanica
            ORDER BY timestamp DESC
            LIMIT 10;
        `)

        const result = statement.all({
            $meteostanica: meteostanica
        });

        return result
    }

    static getDataPropertyDaily(meteostanica, property, date) {
        const tableNames = meteostaniceDB.prepare(`PRAGMA table_info('data');`).all()
        if (!tableNames.find(i => i.name === property)) return null

        const statement = meteostaniceDB.prepare(`
            SELECT strftime('%Y-%m-%d %H:00:00', timestamp) AS timeMark, 
                AVG(${property}) AS value
            FROM data
            WHERE meteostanica = ? AND date(timestamp) = ?  -- Pass 'YYYY-MM-DD' here
            GROUP BY timeMark
            ORDER BY timeMark;
        `)

        const result = statement.all(meteostanica, date);

        return result
    }

    static getDataPropertyMonthly(meteostanica, property, yearMonth) {
        const tableNames = meteostaniceDB.prepare(`PRAGMA table_info('data');`).all()
        if (!tableNames.find(i => i.name === property)) return null

        const statement = meteostaniceDB.prepare(`
            SELECT date(timestamp) AS timeMark, 
                AVG(${property}) AS value
            FROM data
            WHERE meteostanica = ? AND strftime('%Y-%m', timestamp) = ? -- Pass 'YYYY-MM' here
            GROUP BY timeMark
            ORDER BY timeMark;
        `)

        const result = statement.all(meteostanica, yearMonth);

        return result
    }

    static getDataPropertyYearly(meteostanica, property, year) {
        const tableNames = meteostaniceDB.prepare(`PRAGMA table_info('data');`).all()
        if (!tableNames.find(i => i.name === property)) return null

        const statement = meteostaniceDB.prepare(`
            SELECT strftime('%Y-%m', timestamp) AS timeMark, 
                AVG(${property}) AS value
            FROM data
            WHERE meteostanica = ? AND strftime('%Y', timestamp) = ? -- Pass 'YYYY' here
            GROUP BY timeMark
            ORDER BY timeMark;
        `)

        const result = statement.all(meteostanica, year);

        return result
    }

    static getDataPropertyAllTime(meteostanica, property) {
        const tableNames = meteostaniceDB.prepare(`PRAGMA table_info('data');`).all()
        if (!tableNames.find(i => i.name === property)) return null

        const statement = meteostaniceDB.prepare(`
            SELECT strftime('%Y', timestamp) AS timeMark, 
                AVG(${property}) AS value
            FROM data
            WHERE meteostanica = ?
            GROUP BY timeMark
            ORDER BY timeMark;
        `)

        const result = statement.all(meteostanica);

        return result
    }

    static getDateMap(meteostanica) {
        const statement = meteostaniceDB.query("SELECT DISTINCT date(timestamp) as d FROM data WHERE meteostanica = ? ORDER BY d ASC");
        const rows = statement.all(meteostanica);

        return rows.reduce((acc, row) => {
            const [year, month, day] = row.d.split("-");

            if (!acc[year]) acc[year] = {};
            if (!acc[year][month]) acc[year][month] = [];

            acc[year][month].push(day);

            return acc;
        }, {});
    }

    static resetWebsocketKey(id) {
        const websocketKey = generateSecureRandomString()

        meteostaniceDB.prepare(`
            update list
            set websocketKey = ?
            where id = ?;
        `).run(websocketKey, id)
    }

    static getEmails(id) {
        const statement = meteostaniceDB.prepare(`
            WITH all_emails AS (
                -- Get the primary owner
                SELECT owner AS email
                FROM list
                WHERE id = $id

                UNION

                -- Get all subowners from the JSON array
                SELECT json_each.value AS email
                FROM list, json_each(list.subowners)
                WHERE list.id = $id
            )
            SELECT email FROM all_emails WHERE email IS NOT NULL;
        `);

        // .all() returns an array of objects: [{email: '...'}, {email: '...'}]
        const rows = statement.all({ $id: id });

        // Map it to a simple array of strings: ['owner@email.com', 'subowner@email.com']
        return rows.map(row => row.email);
    }

    static getStationDataLast5Minutes(id) {
        const rows = meteostaniceDB.prepare(`
            SELECT * FROM data 
            WHERE meteostanica = ? 
            AND timestamp >= datetime('now', '-6 minutes')
            ORDER BY timestamp DESC
            LIMIT 5;
        `).all(id);

        // Only return the data if we have a full 5-minute window
        return rows.length >= 5 ? rows : null;
    }

    static editWarnings(id, warnings) {
        meteostaniceDB.prepare(`
            UPDATE list 
            SET warnings = json(?) 
            WHERE id = ?;
        `).run(JSON.stringify(warnings), id)
    }

    static async sendWarnings(email, subject, text, html) {
        return await transporter.sendMail({
            from: process.env.WARNING_EMAIL_SMTP_FROM,
            to: email,
            subject,
            text, // Plain-text version of the message
            html, // HTML version of the message
        });
    }
}