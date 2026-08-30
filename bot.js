'use strict';

require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const fs          = require('fs');
const { generatePresentation }          = require('./index');
const { getUser, addCredits, useCredit, setFreeUsed } = require('./db');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// ─── Конфиг ────────────────────────────────────────────────────────────────
const KASPI_PHONE = '+77713436592';
const KASPI_NAME  = 'Мурзабек Н';
const PRICE       = 250; // ₸ за 1 през
const ADMIN_ID    = process.env.ADMIN_CHAT_ID;

// Қазір жасалып жатқандар (spam болдырмау)
const processing = new Set();

// Пайдаланушы жағдайы: сан күтіп тұрмыз ба
const waitingForCount = new Set();

// ─── /start ────────────────────────────────────────────────────────────────
bot.onText(/\/start/, (msg) => {
  const user = getUser(msg.chat.id);
  const hasFree = !user.freeUsed;

  bot.sendMessage(
    msg.chat.id,
    '👋 Сәлем! Мен кәсіби презентация жасайтын ботпын.\n\n' +
    (hasFree
      ? '🎁 Сізге *1 тегін презентация* бар!\n\nТақырыпты жазыңыз — бастаймыз.'
      : `💳 *Баға:* ${PRICE}₸ — 1 презентация\n\nНеше презентация керек екенін жазыңыз (мысалы: *2*)`),
    { parse_mode: 'Markdown' }
  );
});

// ─── /balance ──────────────────────────────────────────────────────────────
bot.onText(/\/balance/, (msg) => {
  const user = getUser(msg.chat.id);
  bot.sendMessage(
    msg.chat.id,
    `💳 Сізде *${user.credits}* презентация кредиті бар.`,
    { parse_mode: 'Markdown' }
  );
});

// ─── /help ─────────────────────────────────────────────────────────────────
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    '📖 *Қалай пайдалану:*\n\n' +
    '1️⃣ Неше презентация керек екенін жазыңыз\n' +
    '2️⃣ Kaspi арқылы төлеңіз\n' +
    '3️⃣ Чекті (PDF) осы ботқа жіберіңіз\n' +
    '4️⃣ Кредит расталған соң тақырыпты жазыңыз\n\n' +
    `📱 Kaspi: *${KASPI_PHONE}* (${KASPI_NAME})`,
    { parse_mode: 'Markdown' }
  );
});

// ─── /confirm <chatId> <amount> — тек admin ────────────────────────────────
bot.onText(/\/confirm (\d+) (\d+)/, async (msg, match) => {
  if (String(msg.chat.id) !== String(ADMIN_ID)) return;

  const targetId = match[1];
  const amount   = parseInt(match[2], 10);

  if (isNaN(amount) || amount < 1) {
    return bot.sendMessage(msg.chat.id, '❌ Дұрыс сан жазыңыз.');
  }

  const user = addCredits(targetId, amount);

  await bot.sendMessage(
    targetId,
    `✅ Төлем расталды!\n\n` +
    `💳 *${amount}* презентация кредиті қосылды.\n\n` +
    `Презентация тақырыбын жазыңыз — бастаймыз! 🚀`,
    { parse_mode: 'Markdown' }
  );

  bot.sendMessage(
    msg.chat.id,
    `✅ ${targetId} → +${amount} кредит. Жиыны: ${user.total}.`
  );
});

// ─── Негізгі хабар обработчигі ─────────────────────────────────────────────
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text   = msg.text;

  if (text && text.startsWith('/')) return;

  // ── Чек (PDF) келсе ──────────────────────────────────────────────────────
  if (msg.document) {
    const fileName = (msg.document.file_name || '').toLowerCase();
    const isPdf    = fileName.endsWith('.pdf') ||
                     msg.document.mime_type === 'application/pdf';

    if (!isPdf) {
      return bot.sendMessage(chatId, '📎 Kaspi чегін *PDF* түрінде жіберіңіз.', { parse_mode: 'Markdown' });
    }

    const userName = [msg.from.first_name, msg.from.last_name].filter(Boolean).join(' ') || 'Белгісіз';

    // Adminге форвард
    await bot.forwardMessage(ADMIN_ID, chatId, msg.message_id);
    await bot.sendMessage(
      ADMIN_ID,
      `📥 *Жаңа чек!*\n\n` +
      `👤 ${userName}\n` +
      `🆔 \`${chatId}\`\n\n` +
      `Растау үшін:\n\`/confirm ${chatId} <сан>\`\n\n` +
      `Мысалы 2 през үшін:\n\`/confirm ${chatId} 2\``,
      { parse_mode: 'Markdown' }
    );

    return bot.sendMessage(
      chatId,
      '📨 Чегіңіз қабылданды!\n\n' +
      '⏳ Растау *5-10 минут* ішінде болады.\n' +
      'Расталған соң хабарлама аласыз.',
      { parse_mode: 'Markdown' }
    );
  }

  if (!text) return;

  const user = getUser(chatId);

  // ── Сан күтіп тұрмыз ба — төлем ақпараты──────────────────────────────────
  if (waitingForCount.has(chatId)) {
    const count = parseInt(text.trim(), 10);

    if (isNaN(count) || count < 1 || count > 50) {
      return bot.sendMessage(chatId, '❗ 1-ден 50-ге дейін сан жазыңыз.');
    }

    waitingForCount.delete(chatId);
    const total = count * PRICE;

    return bot.sendMessage(
      chatId,
      `🧾 *${count} презентация — ${total}₸*\n\n` +
      `💳 Kaspi арқылы төлеңіз:\n` +
      `📱 *${KASPI_PHONE}*\n` +
      `👤 ${KASPI_NAME}\n\n` +
      `Сомасы: *${total}₸*\n\n` +
      `Төлегеннен кейін *чекті (PDF)* осы ботқа жіберіңіз ✅`,
      { parse_mode: 'Markdown' }
    );
  }

  // ── Тегін презентация бар ─────────────────────────────────────────────────
  if (!user.freeUsed) {
    return makePresentaton(chatId, text, true);
  }

  // ── Кредит бар ───────────────────────────────────────────────────────────
  if (user.credits > 0) {
    return makePresentaton(chatId, text, false);
  }

  // ── Кредит жоқ → төлемге жібер ───────────────────────────────────────────
  waitingForCount.add(chatId);
  return bot.sendMessage(
    chatId,
    `💳 Сізде презентация кредиті жоқ.\n\n` +
    `💰 Баға: *${PRICE}₸* — 1 презентация\n\n` +
    `Неше презентация керек? Санын жазыңыз:`,
    { parse_mode: 'Markdown' }
  );
});

// ─── Презентация жасау ─────────────────────────────────────────────────────
async function makePresentaton(chatId, topic, isFree) {
  if (processing.has(chatId)) {
    return bot.sendMessage(chatId, '⏳ Презентацияңыз жасалып жатыр, күтіңіз...');
  }

  processing.add(chatId);

  // Кредитті немесе тегін белгіні алдын-ала жұмса
  if (isFree) {
    setFreeUsed(chatId);
  } else {
    useCredit(chatId);
  }

  const remaining = getUser(chatId).credits;
  let statusMsg;

  try {
    statusMsg = await bot.sendMessage(
      chatId,
      `⏳ Презентация жасалуда...\n\n` +
      `📌 Тақырып: *${topic}*\n` +
      (isFree ? '🎁 Тегін презентация\n' : `💳 Қалған кредит: ${remaining}\n`) +
      `\n_1-2 минут күтіңіз..._`,
      { parse_mode: 'Markdown' }
    );

    const { pptxPath, title } = await generatePresentation(topic);

    await bot.editMessageText('✅ Дайын! Жіберілуде...', {
      chat_id: chatId,
      message_id: statusMsg.message_id,
    });

    await bot.sendDocument(
      chatId,
      pptxPath,
      {
        caption:
          `📊 *${title}*\n\n` +
          (isFree
            ? `🎁 Тегін презентацияңыз дайын!\n\n💳 Келесі презентация үшін: *${PRICE}₸*\nНеше керек екенін жазыңыз.`
            : `💳 Қалған презентация: *${remaining}*`),
        parse_mode: 'Markdown',
      }
    );

    try { fs.unlinkSync(pptxPath); } catch {}

  } catch (err) {
    console.error('[Bot] Error:', err.message);

    // Кредитті қайтар
    if (isFree) {
      const db = require('./db');
      // freeUsed-ты қайтару — edge case, жай кредит беремін
      addCredits(chatId, 1);
    } else {
      addCredits(chatId, 1);
    }

    const errText =
      '❌ Қате орын алды, кредитіңіз қайтарылды.\n\n' +
      'Тақырыпты қайта жіберіп көріңіз.';

    if (statusMsg) {
      await bot.editMessageText(errText, {
        chat_id: chatId,
        message_id: statusMsg.message_id,
      }).catch(() => bot.sendMessage(chatId, errText));
    } else {
      await bot.sendMessage(chatId, errText);
    }

  } finally {
    processing.delete(chatId);
  }
}

console.log('[Bot] Іске қосылды. Хабарлар күтілуде...');
