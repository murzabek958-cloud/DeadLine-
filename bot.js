'use strict';

require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const fs          = require('fs');
const { generatePresentation }                              = require('./index');
const { initDB, getUser, addCredits, useCredit, setFreeUsed } = require('./db');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

const KASPI_PHONE = '+77713436592';
const KASPI_NAME  = 'Мурзабек Н';
const PRICE       = 250;
const ADMIN_ID    = process.env.ADMIN_CHAT_ID;

const processing      = new Set();
const waitingForCount = new Set();

// ─── Негізгі менюдің батырмалары ───────────────────────────────────────────
const MAIN_KEYBOARD = {
  reply_markup: {
    keyboard: [
      [{ text: '💳 Менің есепшотым' }, { text: '❓ Көмек' }],
      [{ text: '💰 Кредит сатып алу' }],
    ],
    resize_keyboard: true,
    persistent: true,
  },
  parse_mode: 'Markdown',
};

// ─── /start ────────────────────────────────────────────────────────────────
bot.onText(/\/start/, async (msg) => {
  const user    = await getUser(msg.chat.id);
  const hasFree = !user.freeUsed;
  bot.sendMessage(
    msg.chat.id,
    '👋 Сәлем! Мен кәсіби презентация жасайтын ботпын.\n\n' +
    (hasFree
      ? '🎁 Сізге *1 тегін презентация* бар!\n\nТақырыпты жазыңыз — бастаймыз.'
      : `💳 *Баға:* ${PRICE}₸ — 1 презентация\n\nТақырыпты жазыңыз немесе кредит сатып алыңыз.`),
    MAIN_KEYBOARD
  );
});

// ─── /balance & "Менің есепшотым" батырмасы ───────────────────────────────
bot.onText(/\/balance/, (msg) => showBalance(msg.chat.id));

async function showBalance(chatId) {
  const user = await getUser(chatId);
  const freeStatus = user.freeUsed
    ? '❌ Тегін презентация пайдаланылды'
    : '🎁 Тегін презентация қол жетімді';

  bot.sendMessage(
    chatId,
    `📊 *Менің есепшотым*\n\n` +
    `💳 Кредит: *${user.credits}* презентация\n` +
    `📦 Жалпы сатып алынды: *${user.total}*\n` +
    `${freeStatus}`,
    { parse_mode: 'Markdown', ...MAIN_KEYBOARD }
  );
}

// ─── /help ─────────────────────────────────────────────────────────────────
bot.onText(/\/help/, (msg) => showHelp(msg.chat.id));

function showHelp(chatId) {
  bot.sendMessage(
    chatId,
    '📖 *Қалай пайдалану:*\n\n' +
    '1️⃣ Тақырыпты жазыңыз (тегін 1 рет)\n' +
    '2️⃣ Кредит сатып алу үшін «💰 Кредит сатып алу» басыңыз\n' +
    '3️⃣ Kaspi арқылы төлеңіз\n' +
    '4️⃣ Чекті (PDF) осы ботқа жіберіңіз\n' +
    '5️⃣ Кредит расталған соң тақырыпты жазыңыз\n\n' +
    `📱 Kaspi: *${KASPI_PHONE}* (${KASPI_NAME})`,
    { parse_mode: 'Markdown', ...MAIN_KEYBOARD }
  );
}

// ─── /confirm <chatId> <amount> — тек admin ────────────────────────────────
bot.onText(/\/confirm (\d+) (\d+)/, async (msg, match) => {
  if (String(msg.chat.id) !== String(ADMIN_ID)) return;

  const targetId = match[1];
  const amount   = parseInt(match[2], 10);

  if (isNaN(amount) || amount < 1) {
    return bot.sendMessage(msg.chat.id, '❌ Дұрыс сан жазыңыз.');
  }

  const user = await addCredits(targetId, amount);

  await bot.sendMessage(
    targetId,
    `✅ Төлем расталды!\n\n` +
    `💳 *${amount}* презентация кредиті қосылды.\n` +
    `📦 Жалпы кредитіңіз: *${user.credits}*\n\n` +
    `Презентация тақырыбын жазыңыз — бастаймыз! 🚀`,
    { parse_mode: 'Markdown', ...MAIN_KEYBOARD }
  );

  bot.sendMessage(msg.chat.id, `✅ ${targetId} → +${amount} кредит. Қалған: ${user.credits}. Жиыны: ${user.total}.`);
});

// ─── Негізгі хабар обработчигі ─────────────────────────────────────────────
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text   = msg.text;

  if (text && text.startsWith('/')) return;

  // ── Батырма: Менің есепшотым ─────────────────────────────────────────────
  if (text === '💳 Менің есепшотым') {
    return showBalance(chatId);
  }

  // ── Батырма: Көмек ────────────────────────────────────────────────────────
  if (text === '❓ Көмек') {
    return showHelp(chatId);
  }

  // ── Батырма: Кредит сатып алу ────────────────────────────────────────────
  if (text === '💰 Кредит сатып алу') {
    waitingForCount.add(chatId);
    return bot.sendMessage(
      chatId,
      `💰 *Кредит сатып алу*\n\n💵 Баға: *${PRICE}₸* — 1 презентация\n\nНеше презентация керек? Санын жазыңыз:`,
      { parse_mode: 'Markdown' }
    );
  }

  // ── Чек (PDF) ────────────────────────────────────────────────────────────
  if (msg.document) {
    const fileName = (msg.document.file_name || '').toLowerCase();
    const isPdf    = fileName.endsWith('.pdf') || msg.document.mime_type === 'application/pdf';

    if (!isPdf) {
      return bot.sendMessage(chatId, '📎 Kaspi чегін *PDF* түрінде жіберіңіз.', { parse_mode: 'Markdown' });
    }

    const userName = [msg.from.first_name, msg.from.last_name].filter(Boolean).join(' ') || 'Белгісіз';

    await bot.forwardMessage(ADMIN_ID, chatId, msg.message_id);
    await bot.sendMessage(
      ADMIN_ID,
      `📥 *Жаңа чек!*\n\n👤 ${userName}\n🆔 \`${chatId}\`\n\n` +
      `Растау үшін:\n\`/confirm ${chatId} <сан>\`\n\nМысалы 2 през үшін:\n\`/confirm ${chatId} 2\``,
      { parse_mode: 'Markdown' }
    );

    return bot.sendMessage(
      chatId,
      '📨 Чегіңіз қабылданды!\n\n⏳ Растау *5-10 минут* ішінде болады.\nРасталған соң хабарлама аласыз.',
      { parse_mode: 'Markdown' }
    );
  }

  if (!text) return;

  // ── Сан күтіп тұрмыз ба — БІРІНШІ тексер ────────────────────────────────
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
      `💳 Kaspi арқылы төлеңіз:\n📱 *${KASPI_PHONE}*\n👤 ${KASPI_NAME}\n\n` +
      `Сомасы: *${total}₸*\n\nТөлегеннен кейін *чекті (PDF)* осы ботқа жіберіңіз ✅`,
      { parse_mode: 'Markdown' }
    );
  }

  // ── Пайдаланушы мәліметін алу ───────────────────────────────────────────
  const user = await getUser(chatId);

  // ── Тегін презентация бар ────────────────────────────────────────────────
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
    `💳 Сізде презентация кредиті жоқ.\n\n💰 Баға: *${PRICE}₸* — 1 презентация\n\nНеше презентация керек? Санын жазыңыз:`,
    { parse_mode: 'Markdown' }
  );
});

// ─── Презентация жасау ─────────────────────────────────────────────────────
async function makePresentaton(chatId, topic, isFree) {
  if (processing.has(chatId)) {
    return bot.sendMessage(chatId, '⏳ Презентацияңыз жасалып жатыр, күтіңіз...');
  }

  processing.add(chatId);

  if (isFree) {
    await setFreeUsed(chatId);
  } else {
    await useCredit(chatId);
  }

  const userAfter = await getUser(chatId);
  const remaining = userAfter.credits;
  let statusMsg;

  try {
    statusMsg = await bot.sendMessage(
      chatId,
      `⏳ Презентация жасалуда...\n\n📌 Тақырып: *${topic}*\n` +
      (isFree ? '🎁 Тегін презентация\n' : `💳 Қалған кредит: ${remaining}\n`) +
      `\n_1-2 минут күтіңіз..._`,
      { parse_mode: 'Markdown' }
    );

    const { pptxPath, title } = await generatePresentation(topic);

    await bot.editMessageText('✅ Дайын! Жіберілуде...', {
      chat_id: chatId, message_id: statusMsg.message_id,
    });

    await bot.sendDocument(
      chatId,
      pptxPath,
      {
        caption:
          `📊 *${title}*\n\n` +
          (isFree
            ? `🎁 Тегін презентацияңыз дайын!\n\n💳 Келесі үшін «💰 Кредит сатып алу» басыңыз.`
            : `💳 Қалған презентация: *${remaining}*`),
        parse_mode: 'Markdown',
      }
    );

    try { fs.unlinkSync(pptxPath); } catch {}

  } catch (err) {
    console.error('[Bot] Error:', err.message);

    // Қате болса — кредитті қайтар
    if (isFree) {
      // freeUsed-ты қайтару мүмкін емес, сондықтан 1 кредит беру
      await addCredits(chatId, 1);
    } else {
      await addCredits(chatId, 1);
    }

    const errText = '❌ Қате орын алды, кредитіңіз қайтарылды.\n\nТақырыпты қайта жіберіп көріңіз.';

    if (statusMsg) {
      await bot.editMessageText(errText, {
        chat_id: chatId, message_id: statusMsg.message_id,
      }).catch(() => bot.sendMessage(chatId, errText));
    } else {
      await bot.sendMessage(chatId, errText);
    }

  } finally {
    processing.delete(chatId);
  }
}

// ─── Іске қосу ─────────────────────────────────────────────────────────────
initDB()
  .then(() => {
    bot.startPolling();
    console.log('[Bot] Іске қосылды. Хабарлар күтілуде...');
  })
  .catch(err => {
    console.error('[DB] Init error:', err);
    process.exit(1);
  });
    
