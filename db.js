'use strict';

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Бот іске қосылғанда бір рет шақырылады
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      chat_id    TEXT PRIMARY KEY,
      credits    INTEGER NOT NULL DEFAULT 0,
      total      INTEGER NOT NULL DEFAULT 0,
      free_used  BOOLEAN NOT NULL DEFAULT FALSE
    )
  `);
  console.log('[DB] Table ready');
}

async function getUser(chatId) {
  try {
    const res = await pool.query(
      'SELECT credits, total, free_used FROM users WHERE chat_id = $1',
      [String(chatId)]
    );
    if (!res.rows.length) return { credits: 0, total: 0, freeUsed: false };
    const r = res.rows[0];
    return { credits: r.credits, total: r.total, freeUsed: r.free_used };
  } catch (err) {
    // Table жоқ болса немесе DB қате берсе — freeUsed:true қайтар (сақтық шара)
    console.error('[DB] getUser error:', err.message);
    return { credits: 0, total: 0, freeUsed: true };
  }
}

async function addCredits(chatId, amount) {
  await pool.query(`
    INSERT INTO users (chat_id, credits, total, free_used)
    VALUES ($1, $2, $2, FALSE)
    ON CONFLICT (chat_id) DO UPDATE
    SET credits = users.credits + $2,
        total   = users.total   + $2
  `, [String(chatId), amount]);
  return getUser(chatId);
}

async function useCredit(chatId) {
  const user = await getUser(chatId);
  if (user.credits < 1) return false;
  await pool.query(
    'UPDATE users SET credits = credits - 1 WHERE chat_id = $1',
    [String(chatId)]
  );
  return true;
}

async function setFreeUsed(chatId) {
  await pool.query(`
    INSERT INTO users (chat_id, credits, total, free_used)
    VALUES ($1, 0, 0, TRUE)
    ON CONFLICT (chat_id) DO UPDATE
    SET free_used = TRUE
  `, [String(chatId)]);
}

module.exports = { initDB, getUser, addCredits, useCredit, setFreeUsed };
