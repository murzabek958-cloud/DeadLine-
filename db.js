'use strict';

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// DB қосылуын тексеру
pool.on('error', (err) => {
  console.error('[DB] Pool error:', err.message);
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
    if (!res.rows.length) {
      // Жаңа пайдаланушы — DB-де жоғы, DEFAULT мәндер
      return { credits: 0, total: 0, freeUsed: false };
    }
    const r = res.rows[0];
    return { credits: r.credits, total: r.total, freeUsed: r.free_used };
  } catch (err) {
    console.error('[DB] getUser error:', err.message);
    // МАҢЫЗДЫ: DB қате берсе — freeUsed:false қайтар,
    // яғни тегін презентацияны БЕРМЕЙІК (ескі кодта true болатын — бұл қате)
    // credits:0 — кредит жоқ деп есептеледі
    return { credits: 0, total: 0, freeUsed: true };
  }
}

async function addCredits(chatId, amount) {
  try {
    await pool.query(`
      INSERT INTO users (chat_id, credits, total, free_used)
      VALUES ($1, $2, $2, FALSE)
      ON CONFLICT (chat_id) DO UPDATE
      SET credits = users.credits + $2,
          total   = users.total   + $2
    `, [String(chatId), amount]);
    console.log(`[DB] addCredits: ${chatId} +${amount}`);
    return getUser(chatId);
  } catch (err) {
    console.error('[DB] addCredits error:', err.message);
    throw err;
  }
}

async function useCredit(chatId) {
  try {
    const user = await getUser(chatId);
    if (user.credits < 1) return false;
    await pool.query(
      'UPDATE users SET credits = credits - 1 WHERE chat_id = $1',
      [String(chatId)]
    );
    console.log(`[DB] useCredit: ${chatId}, remaining: ${user.credits - 1}`);
    return true;
  } catch (err) {
    console.error('[DB] useCredit error:', err.message);
    return false;
  }
}

async function setFreeUsed(chatId) {
  try {
    await pool.query(`
      INSERT INTO users (chat_id, credits, total, free_used)
      VALUES ($1, 0, 0, TRUE)
      ON CONFLICT (chat_id) DO UPDATE
      SET free_used = TRUE
    `, [String(chatId)]);
    console.log(`[DB] setFreeUsed: ${chatId}`);
  } catch (err) {
    console.error('[DB] setFreeUsed error:', err.message);
    throw err;
  }
}

module.exports = { initDB, getUser, addCredits, useCredit, setFreeUsed };
