'use strict';

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on('error', (err) => {
  console.error('[DB] Pool error:', err.message);
});

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      chat_id      TEXT PRIMARY KEY,
      credits      INTEGER NOT NULL DEFAULT 0,
      total        INTEGER NOT NULL DEFAULT 0,
      free_used    BOOLEAN NOT NULL DEFAULT FALSE,
      referred_by  TEXT DEFAULT NULL,
      ref_earnings INTEGER NOT NULL DEFAULT 0
    )
  `);
  // Ескі кестеге баганалар қос (егер жоқ болса)
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by TEXT DEFAULT NULL`);
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS ref_earnings INTEGER NOT NULL DEFAULT 0`);
  console.log('[DB] Table ready');
}

async function getUser(chatId) {
  try {
    const res = await pool.query(
      'SELECT credits, total, free_used, referred_by, ref_earnings FROM users WHERE chat_id = $1',
      [String(chatId)]
    );
    if (!res.rows.length) {
      return { credits: 0, total: 0, freeUsed: false, referredBy: null, refEarnings: 0 };
    }
    const r = res.rows[0];
    return {
      credits: r.credits,
      total: r.total,
      freeUsed: r.free_used,
      referredBy: r.referred_by,
      refEarnings: r.ref_earnings,
    };
  } catch (err) {
    console.error('[DB] getUser error:', err.message);
    return { credits: 0, total: 0, freeUsed: true, referredBy: null, refEarnings: 0 };
  }
}

async function registerUser(chatId, referredBy = null) {
  try {
    await pool.query(`
      INSERT INTO users (chat_id, credits, total, free_used, referred_by, ref_earnings)
      VALUES ($1, 0, 0, FALSE, $2, 0)
      ON CONFLICT (chat_id) DO NOTHING
    `, [String(chatId), referredBy ? String(referredBy) : null]);
  } catch (err) {
    console.error('[DB] registerUser error:', err.message);
  }
}

async function addCredits(chatId, amount) {
  try {
    await pool.query(`
      INSERT INTO users (chat_id, credits, total, free_used, ref_earnings)
      VALUES ($1, $2, $2, FALSE, 0)
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

// Реферал арқылы тіркелген адам санын +1 арттыр
// Егер 3-тің еселігіне жетсе — 1 кредит бер
// Қайтарады: { newCount, bonusGiven }
async function incrementRefCount(referrerId) {
  try {
    const res = await pool.query(`
      UPDATE users
      SET ref_earnings = ref_earnings + 1
      WHERE chat_id = $1
      RETURNING ref_earnings, credits
    `, [String(referrerId)]);

    const newCount = res.rows[0]?.ref_earnings || 0;

    if (newCount % 3 === 0) {
      await pool.query(
        'UPDATE users SET credits = credits + 1 WHERE chat_id = $1',
        [String(referrerId)]
      );
      console.log(`[DB] refBonus: ${referrerId} earned +1 credit (${newCount} referrals)`);
      return { newCount, bonusGiven: true };
    }

    console.log(`[DB] refCount: ${referrerId} now has ${newCount} referrals`);
    return { newCount, bonusGiven: false };
  } catch (err) {
    console.error('[DB] incrementRefCount error:', err.message);
    return { newCount: 0, bonusGiven: false };
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
      INSERT INTO users (chat_id, credits, total, free_used, ref_earnings)
      VALUES ($1, 0, 0, TRUE, 0)
      ON CONFLICT (chat_id) DO UPDATE
      SET free_used = TRUE
    `, [String(chatId)]);
    console.log(`[DB] setFreeUsed: ${chatId}`);
  } catch (err) {
    console.error('[DB] setFreeUsed error:', err.message);
    throw err;
  }
}

async function resetFreeUsed(chatId) {
  try {
    await pool.query(
      'UPDATE users SET free_used = FALSE WHERE chat_id = $1',
      [String(chatId)]
    );
    console.log(`[DB] resetFreeUsed: ${chatId}`);
  } catch (err) {
    console.error('[DB] resetFreeUsed error:', err.message);
  }
}

module.exports = { initDB, getUser, registerUser, addCredits, incrementRefCount, useCredit, setFreeUsed, resetFreeUsed };
      
