import { Database } from "bun:sqlite";
const ratelimitsDB = new Database("./data/ratelimits.sqlite");

export default (type, value, limit, seconds) => {
    ratelimitsDB.run(`create table if not exists ${type} (
        subject text not null primary key,
        countLeft integer default ${limit},
        timestamp datetime default current_timestamp
    );`)

    const statement = ratelimitsDB.prepare(`
        INSERT INTO ${type} (subject)
        VALUES ($value)
        ON CONFLICT(subject) DO UPDATE SET
            countLeft = CASE 
                WHEN (strftime('%s', 'now') - strftime('%s', timestamp)) > $seconds THEN $limit
                ELSE MAX(0, countLeft - 1)
            END,
            timestamp = CASE 
                WHEN (strftime('%s', 'now') - strftime('%s', timestamp)) > $seconds THEN CURRENT_TIMESTAMP
                ELSE timestamp
            END
        RETURNING countLeft, timestamp;
    `);

    const result = statement.get({
        $value: value,
        $seconds: seconds,
        $limit: limit
    });
    
    if (result.countLeft <= 0) {
        const resetTime = new Date(new Date(result.timestamp).getTime() + seconds * 1000);
        return { status: true, until: resetTime };
    }

    return { status: false, countLeft: result.countLeft };
}