const express = require("express");
const pool = requre("./db.js");


const app = express()
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Messenger Backend läuft");
});

// Test-Route für DB-Verbidung
app.get("/db-test", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("DB-Fehler");
    }
});

app.listen(3000, () => {
    console.log("Server läuft auf http://localhost:3000");
});
