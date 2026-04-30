import axios from 'axios';

const WAHA_URL = process.env.WAHA_URL || 'http://localhost:3000';
const WAHA_API_KEY = process.env.WAHA_API_KEY || '';

export const sendWhatsAppMessage = async (to: string, message: string) => {
  if (!WAHA_URL) return;
  
  try {
    const res = await axios.post(`${WAHA_URL}/api/sendText`, {
      chatId: `${to}@c.us`,
      text: message,
      session: 'default'
    }, {
      headers: { 'X-Api-Key': WAHA_API_KEY }
    });
    return res.data;
  } catch (error) {
    console.error('WhatsApp Send Error:', error);
    throw error;
  }
};
