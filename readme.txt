# Messenger Backend + Frontend

Ein einfacher Chat/Messenger, implementiert mit **Node.js**, **Express**, **PostgreSQL** und einem minimalen Frontend.  
Dieses Repository enthält ein Backend für Registrierung, Login, Chat-Erstellung und Nachrichten, sowie ein simples HTML-Frontend zum Testen.

---


## 🚀 Voraussetzungen


Bevor du startest, stelle sicher, dass folgende Software installiert ist:
- **Node.js** (Version 18+ empfohlen)  
- **npm** (deine Version: 11.6.2 oder höher)  
- **PostgreSQL** (Version 18.1)  
- **pgAdmin 4** (optional, für DB-Management)  
- **http-server** (für das Frontend)  


---


## 🛠 Installation


1. **Repository klonen:**

```bash
:> git clone <DEIN_REPO_URL>
:> cd <REPO_ORDNER>

2. **Node.js Abhängigkeiten installieren:**

```bash
:> npm install

3. **Nodemon global installieren (optional, für automatisches Neuladen beim Entwickeln):**

```bash
:>npm install -g nodemon

4. **http-server installieren (für Frontend-Test):**

```bash
npm install -g http-server


---


## 🗄 Datenbank einrichten (PostgreSQL)


1. **Neue Datenbank erstellen:**

```sql
CREATE DATABASE messenger
WITH 
    ENCODING 'UTF8'
    LC_COLLATE='de_DE.UTF-8'
    LC_CTYPE='de_DE.UTF-8'
    TEMPLATE=template0;


2. **Tabellen erstellen:**

```sql
-- Users
CREATE TABLE users ( 
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Chats
CREATE TABLE chats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Chat <-> User (Many-to-Many)
CREATE TABLE chat_users (
    chat_id INT REFERENCES public.chats(id) ON DELETE CASCADE,
    user_id INT REFERENCES public.users(id) ON DELETE CASCADE,
    PRIMARY KEY (chat_id, user_id)
);

-- Messages
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    chat_id INT REFERENCES public.chats(id) ON DELETE CASCADE,
    user_id INT REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);


---


## 🔧 Backend konfigurieren

1. **.env Datei erstellen im Projektordner mit folgendem Inhalt:**

```env
PORT=3000
DB_USER=dein_db_user
DB_PASSWORD=dein_db_passwort
DB_HOST=localhost
DB_PORT=5432
DB_NAME=messenger

2. **Backend starten:**

```bash
:> npm run dev

    - Der Server läuft jetzt auf http://localhost:3000.
    - Teste die DB-Verbindung:

        http://localhost:3000/db-test


---


## 🌐 Frontend starten

1. **Navigiere ins Frontend-Verzeichnis (oder Hauptverzeichnis, falls HTML direkt dort liegt).**

2. **Starte den HTTP-Server:**

```bash
:> http-server . -p 5500 --cors

3. **Frontend aufrufen:**

        http://localhost:5500

    - Dort kannst du Benutzer registrieren, einloggen, Chats erstellen und Nachrichten senden.


---


++ 📝 Hinweise

- Das Backend verwendet Express, bcrypt, cors und dotenv.

- Node.js sendet Daten UTF-8, daher sollten Sonderzeichen korrekt gespeichert werden.