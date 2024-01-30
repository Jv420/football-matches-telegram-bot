const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

const BOT_TOKEN = process.env.TOKEN;
const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('Welcome! Please select a date:', Markup.inlineKeyboard([
    [Markup.button.callback('Yesterday', 'DATE_YESTERDAY')],
    [Markup.button.callback('Today', 'DATE_TODAY')],
    [Markup.button.callback('Tomorrow', 'DATE_TOMORROW')],
  ]));
});

const dateActions = {
  'DATE_YESTERDAY': -1,
  'DATE_TODAY': 0,
  'DATE_TOMORROW': 1,
};

Object.entries(dateActions).forEach(([action, offset]) => {
  bot.action(action, async (ctx) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    const fetchUrl = action === 'DATE_YESTERDAY' 
      ? `https://football-matches-telegram-bot.vercel.app/api/fetchMatchesForYesterday?date=${dateString}`
      : `https://football-matches-telegram-bot.vercel.app/api/fetchMatchesForDate?date=${dateString}`;

    try {
      const response = await fetch(fetchUrl);
      const data = await response.text();
      ctx.reply(data, { parse_mode: 'HTML' });
    } catch (error) {
      console.error('Error:', error);
      ctx.reply('Failed to fetch matches for the selected date.', { parse_mode: 'HTML' });
    }

    ctx.answerCbQuery();
  });
});

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      await bot.handleUpdate(req.body);
      res.status(200).send('OK');
    } catch (error) {
      console.error('Telegram bot error:', error);
      res.status(500).send('Bot error');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
};
