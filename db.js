const pg = require("pg");

const pool = new pg.Pool({
    user: "postgres",
    host: "localhost",
    database: "messenger",
    password: "DEIN_PASSWORD",
    port: 5432,
});

module.exports = pool;