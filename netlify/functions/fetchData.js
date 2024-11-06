const axios = require('axios');
const io = require('socket.io-client');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  const { url } = JSON.parse(event.body);
  const airtableToken = 'Bearer patX200VGkvIdjhvl.85e8e525a33b49ef814bfbfc0c0af14631faf88b39fd566a99a5c3de203a181a';

  try {
    const response = await axios.get(url, {
      headers: { Authorization: airtableToken },
    });

    // Send data to WebSocket server for real-time updates
    const socket = io.connect('https://your-websocket-server-url.com');
    socket.emit('dataUpdate', response.data);
    socket.disconnect();

    return {
      statusCode: 200,
      body: JSON.stringify({ data: response.data }),
    };
  } catch (error) {
    console.error('Error fetching data from Airtable:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data' }),
    };
  }
};
