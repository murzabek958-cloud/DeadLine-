''use strict';

const { Client } = require('pg');

let client = null;

async function getClient() {
  if (client) return client;
  client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      chat_id    TEXT PRIMARY KEY,
      credits    INTEGER DEFAULT 0,
      total      INTEGER DEFAULT 0,
      free_used  BOOLEAN DEFAULT FALSE
    )
  `);
  console.log('[DB] PostgreSQL connected');
  return client;
}

async function getUser(chatId) {
  const db = await getClient();
  const res = await db.query('SELECT * FROM users WHERE chat_id = $1', [String(chatId)]);
  if (!res.rows.length) return { credits: 0, total: 0, freeUsed: false };
  const r = res.rows[0];
  return { credits: r.credits, total: r.total, freeUsed: r.free_used };
}

async function addCredits(chatId, amount) {
  const db = await getClient();
  await db.query(`
    INSERT INTO users (chat_id, credits, total, free_used)
    VALUES ($1, $2, $2, FALSE)
    ON CONFLICT (chat_id) DO UPDATE
    SET credits = users.credits + $2,
        total   = users.total   + $2
  `, [String(chatId), amount]);
  return getUser(chatId);
}

async function useCredit(chatId) {
  const db = await getClient();
  const user = await getUser(chatId);
  if (user.credits < 1) return false;
  await db.query('UPDATE users SET credits = credits - 1 WHERE chat_id = $1', [String(chatId)]);
  return true;
}

async function setFreeUsed(chatId) {
  const db = await getClient();
  await db.query(`
    INSERT INTO users (chat_id, credits, total, free_used)
    VALUES ($1, 0, 0, TRUE)
    ON CONFLICT (chat_id) DO UPDATE
    SET free_used = TRUE
  `, [String(chatId)]);
}

module.exports = { getUser, addCredits, useCredit, setFreeUsed };
