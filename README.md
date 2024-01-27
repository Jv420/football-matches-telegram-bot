# Football Matches Telegram Bot

This Telegram bot provides users with the latest football matches information, including fixtures and results, by scraping data from the BBC Sport website. It offers a convenient way for users to stay updated with their favorite football matches directly through Telegram.

## Features

- **Date Selection**: Users can select "Yesterday", "Today", or "Tomorrow" to view matches for the respective dates.
- **Match Information**: For each selected date, the bot displays:
  - Match number
  - Teams playing
  - Time of the match or the score (for past matches)
- **Interactive Interface**: The bot uses Telegram's inline keyboards for an interactive user experience, allowing users to easily choose dates.

## Technologies Used

- Node.js
- Axios (for HTTP requests)
- Cheerio (for HTML parsing)
- Telegraf (for Telegram bot framework)

## Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/kidus7/football-matches-telegram-bot.git
   cd football-matches-telegram-bot
   ```

2. **Install dependencies**

   Ensure you have Node.js installed, then run:

   ```bash
   npm install
   ```

3. **Environment Variables**

   Create a `.env` file in the root directory of your project and add the following variables:

   ```plaintext
   TOKEN=your_telegram_bot_token
   CHAT_ID=your_chat_id
   ```

   Replace `your_telegram_bot_token` with the token you receive from [@BotFather](https://t.me/botfather) and `your_chat_id` with the chat ID where you want to send messages.

4. **Running the Bot**

   Start the bot with:

   ```bash
   node index.js
   ```

## Usage

- Start a chat with the bot on Telegram.
- Use the `/start` command to initiate the bot.
- Choose a date using the inline keyboard buttons to view football matches for that day.

# Thank You