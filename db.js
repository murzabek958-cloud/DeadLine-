'use strict';

const fs   = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'users.json');

function load() {
  if (!fs.existsSync(DB_PATH)) return {};
  try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); } catch { return {}; }
}

function save(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function getUser(chatId) {
  const db = load();
  return db[String(chatId)] || { credits: 0, total: 0, freeUsed: false };
}

function addCredits(chatId, amount) {
  const db = load();
  const id = String(chatId);
  if (!db[id]) db[id] = { credits: 0, total: 0, freeUsed: false };
  db[id].credits += amount;
  db[id].total   += amount;
  save(db);
  return db[id];
}

function useCredit(chatId) {
  const db = load();
  const id = String(chatId);
  if (!db[id] || db[id].credits < 1) return false;
  db[id].credits -= 1;
  save(db);
  return true;
}

function setFreeUsed(chatId) {
  const db = load();
  const id = String(chatId);
  if (!db[id]) db[id] = { credits: 0, total: 0, freeUsed: false };
  db[id].freeUsed = true;
  save(db);
}

module.exports = { getUser, addCredits, useCredit, setFreeUsed };
