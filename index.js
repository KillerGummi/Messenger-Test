require('dotenv').config();
const express = require("express");
const cors = require('cors');
const pool = require("./db.js"); // PG Pool
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Messenger Backend läuft"));

///////////////////////
// TEST ROUTE
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

// Benutzer registrieren
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    console.log({username, password});
    console.log(Buffer.from(username).toString('hex'));

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Insert into DB JSON:", JSON.stringify({ username, password: hashedPassword }, null, 2));
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
            [username, hashedPassword]
        );
        res.json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') return res.status(409).json({ error: "Username existiert bereits" });
        console.error(err);
        res.status(500).send("Fehler beim Registrieren");
    }
});

// Login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query(
            'SELECT id, username, password FROM users WHERE username=$1',
            [username]
        );
        if (result.rows.length === 0) return res.status(401).json({ error: 'Login fehlgeschlagen: Benutzer nicht gefunden'});
        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Login fehlgeschlagen: Passwort falsch'});
        res.json({ id: user.id, username: user.username });
    } catch (err) {
        console.error(err);
        res.status(500).send("Fehler beim Login");
    }
});

// Chats erstellen
app.post("/chats", async (req, res) => {
    const { name, user_ids } = req.body;
    try {
        const chatResult = await pool.query(
            'INSERT INTO chats (name) VALUES ($1) RETURNING id, name, created_at',
            [name || null]
        );
        const chat = chatResult.rows[0];
        await Promise.all(user_ids.map(uid => 
            pool.query('INSERT INTO chat_users (chat_id, user_id) VALUES ($1,$2)', [chat.id, uid])
        ));
        res.json(chat);
    } catch (err) {
        console.error(err);
        res.status(500).send("Fehler beim Erstellen des Chats");
    }
});

// Chats eines Users
app.get("/chats/:userId/chats", async (req, res) => {
    const userId = req.params.userId;
    try {
        const result = await pool.query(
            'SELECT c.id, c.name, c.created_at FROM chats c JOIN chat_users cu ON c.id=cu.chat_id WHERE cu.user_id=$1',
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Fehler beim Abrufen der Chats");
    }
});

// Nachrichten senden
app.post("/chats/:chatId/messages", async (req, res) => {
    const chatId = req.params.chatId;
    const { user_id, content } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO messages (chat_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
            [chatId, user_id, content]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Fehler beim Senden");
    }
});

// Nachrichten abrufen
app.get("/chats/:chatId/messages", async (req, res) => {
    const chatId = req.params.chatId;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    try {
        const result = await pool.query(
            `SELECT m.id, m.content, m.created_at, u.username
             FROM messages m JOIN users u ON m.user_id=u.id
             WHERE m.chat_id=$1 ORDER BY m.created_at DESC LIMIT $2 OFFSET $3`,
            [chatId, limit, offset]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Fehler beim Abrufen der Nachrichten");
    }
});

app.listen(PORT, () => console.log(`Server läuft auf http://localhost:${PORT}`));
