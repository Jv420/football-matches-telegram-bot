const axios = require('axios');
require('dotenv').config();

// Function to set the Telegram bot webhook
const setWebhook = async() => {
  const BOT_TOKEN = process.env.TOKEN;
  const WEBHOOK_URL = process.env.WEBHOOK_URL;

  try {
    const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, { url: WEBHOOK_URL });
    console.log('Webhook set successfully:', response.data);
  } catch (error) {
    console.error('Error setting webhook:', error.response.data);
  }
}

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    // Optionally, call setWebhook here if you want to set it when a specific GET request is made
    await setWebhook();

    res.status(200).json({ message: "This is a Football matches scores fetching API" });
  } else {
    res.status(405).send('Method Not Allowed');
  }
};

// Optionally, call setWebhook here if you want to set the webhook when the module is loaded
// setWebhook().catch(console.error);
