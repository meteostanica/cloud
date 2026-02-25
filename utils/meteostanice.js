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
    timestamp datetime default current_timestamp
);`)

meteostaniceDB.run(`create table if not exists data (
    id text not null primary key,
    meteostanica text not null,
    timestamp datetime default current_timestamp,

    indoorTemp text not null,
    indoorPressure text not null,
    indoorHumidity text not null,
    indoorAltitude text not null,

    outdoorConnected integer not null,
    outdoorTemp text not null,
    outdoorPressure text not null,
    outdoorHumidity text not null,
    outdoorAltitude text not null
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
    showIndoorAltitude integer default 1,

    showOutdoorConnected integer default 1,
    showOutdoorTemp integer default 1,
    showOutdoorPressure integer default 1,
    showOutdoorHumidity integer default 1,
    showOutdoorAltitude integer default 1
);`)

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
            WHERE owner = $owner AND id = $id;
        `)

        const result = statement.get({
            $owner: owner,
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
            WHERE owner = $owner;
        `)

        const result = statement.all({
            $owner: owner
        });

        return result
    }

    static edit(id, newName, newDescription, newOwner) {
        meteostaniceDB.prepare(`
            update list
            set name = ?,
            description = ?,
            owner = ?
            where id = ?;
        `).run(newName, newDescription, newOwner, id)
    }

    static remove(id) {
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
            WHERE owner = $owner AND id = $id;
        `).run({
            $id: id
        });
    }

    static removeOwned(owner) {
        const meteostanice = this.getOwned(owner)

        for (const meteostanica of meteostanice) {
            this.remove(meteostanica.owner, meteostanica.id)
        }
    }

    static postData(meteostanica, indoorTemp, indoorPressure, indoorHumidity, indoorAltitude, outdoorConnected, outdoorTemp, outdoorPressure, outdoorHumidity, outdoorAltitude) {
        const id = nanoid()

        meteostaniceDB.prepare(`
            INSERT INTO data (id, meteostanica, indoorTemp, indoorPressure, indoorHumidity, indoorAltitude, outdoorConnected, outdoorTemp, outdoorPressure, outdoorHumidity, outdoorAltitude) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `).run(id, meteostanica, indoorTemp, indoorPressure, indoorHumidity, indoorAltitude, outdoorConnected, outdoorTemp, outdoorPressure, outdoorHumidity, outdoorAltitude)
    }

    static getData(meteostanica) {
        const statement = meteostaniceDB.prepare(`
            SELECT *
            FROM data 
            WHERE meteostanica = $meteostanica;
        `)

        const result = statement.all({
            $meteostanica: meteostanica
        });

        return result
    }

    static resetWebsocketKey(id) {
        const websocketKey = generateSecureRandomString()

        meteostaniceDB.prepare(`
            update list
            set websocketKey = ?
            where id = ?;
        `).run(websocketKey, id)
    }
}