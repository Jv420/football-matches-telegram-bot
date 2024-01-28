const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

  const BOT_TOKEN = process.env.TOKEN;
  const CHANNEL_ID = process.env.CHAT_ID;
  const BASE_URL = 'https://www.bbc.com/sport/football/scores-fixtures';
  const PORT = 3000

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
    bot.action(action, (ctx) => {
      const date = new Date();
      date.setDate(date.getDate() + offset);

      if (action === 'DATE_YESTERDAY') {
        fetchMatchesForYesterday(ctx, date);
      } else {
        fetchMatchesForDate(ctx, date);
      }

      ctx.answerCbQuery();
    });
  });

  const fetchMatchesForDate = async (ctx, date) => {
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const url = `${BASE_URL}/${dateString}`;

    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      let message = `<b>Football Matches on ${dateString}:</b>\n\n`;

      $('.qa-match-block').each((index, block) => {
        const dateText = $(block).find('.sp-c-match-list-heading').text().trim();
        message += `<b>${dateText}</b>\n`; // Making dateText bold for better visibility

        $(block).find('.sp-c-fixture').each((fixtureIndex, fixture) => {
          const homeTeam = $(fixture).find('.sp-c-fixture__team--time-home .qa-full-team-name').text().trim();
          const awayTeam = $(fixture).find('.sp-c-fixture__team--time-away .qa-full-team-name').text().trim();
          const timeOrScore = $(fixture).find('.sp-c-fixture__number--time').text().trim(); // Time for fixtures, score for results

          message += `⚽️ Match ${fixtureIndex + 1}: ${homeTeam} vs ${awayTeam}\n`;
          message += `🕒 Time: ${timeOrScore}\n\n`;
        });

        message += '\n'
      });

      if (message.length > 4000) {
        const parts = message.match(/[\s\S]{1,4000}/g) || [];
        for (const part of parts) {
          await ctx.reply(part, { parse_mode: 'HTML' });
        }
      } else {
        await ctx.reply(message, { parse_mode: 'HTML' });
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
      await ctx.reply('Failed to fetch matches for the selected date.', { parse_mode: 'HTML' });
    }
  };

  const fetchMatchesForYesterday = async (ctx, date) => {
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const url = `${BASE_URL}/${dateString}`;

    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      let message = `<b>Football Matches on ${dateString}:</b>\n\n`;

      $('.qa-match-block').each((index, block) => {
        const dateText = $(block).find('.sp-c-match-list-heading').text().trim();
        message += `<b>${dateText}</b>\n`;

        $(block).find('.sp-c-fixture').each((fixtureIndex, fixture) => {
          const homeTeam = $(fixture).find('.sp-c-fixture__team-name--home').text().trim();
          const awayTeam = $(fixture).find('.sp-c-fixture__team-name--away').text().trim();
          const timeOrScoreHome = $(fixture).find('.sp-c-fixture__number--home').text().trim(); // Home score
          const timeOrScoreAway = $(fixture).find('.sp-c-fixture__number--away').text().trim(); // Away score
          const timeOrScore = timeOrScoreHome && timeOrScoreAway ? `${timeOrScoreHome}-${timeOrScoreAway}` : "TBD";

          message += `⚽️ Match ${fixtureIndex + 1}: ${homeTeam} vs ${awayTeam}\n`;
          message += `🕒 Score/Time: ${timeOrScore}\n\n`;
        });

        message += '\n';
      });

      if (message.length > 4000) {
        const parts = message.match(/[\s\S]{1,4000}/g) || [];
        for (const part of parts) {
          await ctx.reply(part, { parse_mode: 'HTML' });
        }
      } else {
        await ctx.reply(message, { parse_mode: 'HTML' });
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
      await ctx.reply('Failed to fetch matches for the selected date.', { parse_mode: 'HTML' });
    }
  };

  app.get('/', (req, res) => {
    res.send({message: 'Welcome to Footbal matches telegram bot API!'})
  })
  
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
    bot.launch();
  })
  