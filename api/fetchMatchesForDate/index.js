const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    const BASE_URL = 'https://www.bbc.com/sport/football/scores-fixtures';
    const dateString = req.query.date;

    if (!dateString) {
        res.status(400).send('Date parameter is required');
        return;
    }

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
  
        // if (message.length > 4000) {
        //   const parts = message.match(/[\s\S]{1,4000}/g) || [];
        //   for (const part of parts) {
        //     await ctx.reply(part, { parse_mode: 'HTML' });
        //   }
        // } else {
        //   await ctx.reply(message, { parse_mode: 'HTML' });
        // }

        res.status(200).send(message);
    } catch (error) {
        console.error('Error fetching matches:', error);
        res.status(500).send('Failed to fetch matches');
    }
};
