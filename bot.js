const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const { main, group, cancel } = require("./src/key/keyArray");
dotenv.config();
const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  if (text == "/start") {
    bot.sendMessage(chatId, "Bosh menu", {
      reply_markup: { keyboard: main, resize_keyboard: true },
    });
  } else if (text == "Jamoalar") {
    bot.sendMessage(chatId, "Jamoalar: {list}", {
      reply_markup: { keyboard: group, resize_keyboard: true },
    });
  } else if (text == "Jamoa qo'shish") {
    bot.sendMessage(chatId, "Jamoa nomini kiriting.", {
      reply_markup: { keyboard: cancel, resize_keyboard: true },
    });
  } else if (!text == false) {
    bot.sendMessage(
      chatId,
      "Ishtirokchilarni nomini kiriting. Namuna: Alex Mullen.Andrea Muzii.Katie Kermode",
      {
        reply_markup: { keyboard: cancel, resize_keyboard: true },
      }
    );
  } else if (!text == false) {
    bot.sendMessage(chatId, "Jamoa qo'shildi. Jamoa Malumotlari: {}", {
      reply_markup: { keyboard: group, resize_keyboard: true },
    });
  } else if (text == "Team1") {
    bot.sendMessage(chatId, "Jamoa Malumotlari: {}", {
      reply_markup: { keyboard: group, resize_keyboard: true },
    });
  }
});
