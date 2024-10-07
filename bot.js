const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const SERVER_API_URL = "https://api.mcsrvstat.us/3/play.minecraft.uz";

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

async function fetchServerStatus(apiUrl) {
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error(`Xatolik sodir bo'ldi: ${error.message}`);
    return null;
  }
}

function formatServerInfo(data) {
  if (!data) return "Ma'lumotlar kelishida xatolik";

  let info = `Server Manzili: play.minecraft.uz\n`;
  info += `Versiya: ${data.version}\n`;
  info += `Server statusi: ${
    data.online ? "🟢 Ishlamoqda" : "🔴 Ishlamayapdi"
  }\n`;
  info += `Faol o'yinchilar: ${data.players.online}/${data.players.max}\n`;

  if (data.players.online > 0) {
    info += "O'yinchilar ro'yxati:\n";
    data.players.list.forEach((player) => {
      info += ` - ${player.name}\n`;
    });
  } else {
    info += "O'yinchilar yo'q";
  }

  return info;
}

bot.onText(/\/status/, async (msg) => {
  const chatId = msg.chat.id;
  const serverData = await fetchServerStatus(SERVER_API_URL);
  const serverInfo = formatServerInfo(serverData);

  bot.sendMessage(chatId, serverInfo);
});

console.log("Bot ishlamoqda...");
