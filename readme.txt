hello world


-- Database
CREATE DATABASE messenger
WITH 
    ENCODING 'UTF8'
    LC_COLLATE='de_DE.UTF-8'
    LC_CTYPE='de_DE.UTF-8'
    TEMPLATE=template0;

--Tables--
-- Users
CREATE TABLE public.users ( 
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Chats
CREATE TABLE public.chats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Chat <-> User (Many-to-Many)
CREATE TABLE public.chat_users (
    chat_id INT REFERENCES public.chats(id) ON DELETE CASCADE,
    user_id INT REFERENCES public.users(id) ON DELETE CASCADE,
    PRIMARY KEY (chat_id, user_id)
);

-- Messages
CREATE TABLE public.messages (
    id SERIAL PRIMARY KEY,
    chat_id INT REFERENCES public.chats(id) ON DELETE CASCADE,
    user_id INT REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);