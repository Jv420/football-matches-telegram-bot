const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }
    res.status(200).json({message: "This is a Footbal matches scores fetching API" });
};