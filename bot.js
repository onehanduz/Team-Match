const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const dotenv = require("dotenv");
let {
  main,
  cancel,
  getAllTeam,
  diceplines,
  getAllGames,
} = require("./src/key/keyArray");
dotenv.config();
const token = process.env.BOT_TOKEN;
const pool = require("./src/db");
const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  if (
    chatId == "863638300" ||
    chatId == "568063499" ||
    chatId == "1314213542"
  ) {
    const text = msg.text;
    if (text == "/start" || text == "Qaytish") {
      bot.sendMessage(chatId, "*Bosh menu*", {
        reply_markup: { keyboard: main, resize_keyboard: true },
        parse_mode: "Markdown",
      });

      //O'yinlar
    } else if (text == "O'yinlar") {
      let games = getAllGames(pool);
      bot.sendMessage(chatId, "*Tugamagan o'yinlar*⤵️:", {
        reply_markup: { keyboard: await games, resize_keyboard: true },
        parse_mode: "Markdown",
      });
    } else if (text == "O'yin yaratish") {
      const query = await pool.query("SELECT * FROM team");
      let data = "Jamolar⤵️:";
      for (const iterator of query.rows) {
        data =
          data + `\n\n👥*Nomi*:${iterator.name}\n🆔:\`\`${iterator.id}\`\``;
      }
      bot.sendMessage(
        chatId,
        data +
          "\n\n📃*Yo'nalishlar*: 7-Random\n\n❗️*O'yin qo'shish uchun: /add_games:1-jamoa 🆔si:2-jamoa 🆔si:yo'nalish raqami*\n\n⁉️*Namuna:* `/add_games:1:2:7`",
        {
          reply_markup: { keyboard: main, resize_keyboard: true },
          parse_mode: "Markdown",
        }
      );
    } else if (!text == false && text.includes("/add_games")) {
      const text_clear = text.split(":");
      const query = await pool.query(
        `INSERT INTO games(team1, team2) VALUES ($1, $2);`,
        [text_clear[1], text_clear[2]]
      );
      const query_team1 = await pool.query(
        `SELECT * FROM team WHERE id = $1;`,
        [text_clear[1]]
      );
      const query_team2 = await pool.query(
        `SELECT * FROM team WHERE id = $1;`,
        [text_clear[2]]
      );
      let gamess = "";
      if (text_clear[3] == "7") {
        gamess =
          "*" +
          query_team1.rows[0].player1 +
          " 🆚 " +
          query_team2.rows[0].player1 +
          " " +
          diceplines[Math.floor(Math.random() * 6)] +
          "\n" +
          query_team1.rows[0].player1 +
          " 🆚 " +
          query_team2.rows[0].player2 +
          " " +
          diceplines[Math.floor(Math.random() * 6)] +
          "\n" +
          query_team1.rows[0].player1 +
          " 🆚 " +
          query_team2.rows[0].player3 +
          " " +
          diceplines[Math.floor(Math.random() * 6)] +
          "\n" +
          query_team1.rows[0].player2 +
          " 🆚 " +
          query_team2.rows[0].player1 +
          " " +
          diceplines[Math.floor(Math.random() * 6)] +
          "\n" +
          query_team1.rows[0].player2 +
          " 🆚 " +
          query_team2.rows[0].player2 +
          " " +
          diceplines[Math.floor(Math.random() * 6)] +
          "\n" +
          query_team1.rows[0].player2 +
          " 🆚 " +
          query_team2.rows[0].player3 +
          " " +
          diceplines[Math.floor(Math.random() * 6)] +
          "\n" +
          query_team1.rows[0].player3 +
          " 🆚 " +
          query_team2.rows[0].player1 +
          " " +
          diceplines[Math.floor(Math.random() * 6)] +
          "\n" +
          query_team1.rows[0].player3 +
          " 🆚 " +
          query_team2.rows[0].player2 +
          " " +
          diceplines[Math.floor(Math.random() * 6)] +
          "\n" +
          query_team1.rows[0].player3 +
          " 🆚 " +
          query_team2.rows[0].player3 +
          " " +
          diceplines[Math.floor(Math.random() * 6)] +
          "\n" +
          "*";
      }
      let games = getAllGames(pool);
      bot.sendMessage(chatId, "🧠*O'yin*: \n\n" + gamess, {
        reply_markup: { keyboard: await games, resize_keyboard: true },
        parse_mode: "Markdown",
      });
    } else if (!text == false && text.includes("/game")) {
      const text_clear = text.split(":");
      const games_query = await pool.query(
        `SELECT * FROM games WHERE id = $1;`,
        [text_clear[2]]
      );
      const team1 = await pool.query(`SELECT * FROM team WHERE id = $1;`, [
        games_query.rows[0].team1,
      ]);
      const team2 = await pool.query(`SELECT * FROM team WHERE id = $1;`, [
        games_query.rows[0].team2,
      ]);
      let games = getAllGames(pool);
      bot.sendMessage(
        chatId,
        `🧠*O'yin* 🆔: ${games_query.rows[0].id}\n👥*Jamoalar haqida ma'lumot:* \n\n *${team1.rows[0].name} \n1.${team1.rows[0].player1}\n2.${team1.rows[0].player2}\n3.${team1.rows[0].player3}\n\n${team2.rows[0].name} \n1.${team2.rows[0].player1}\n2.${team2.rows[0].player2}\n3.${team2.rows[0].player3}*\n\n*Natijalarni kiritish uchun:* /result:o'yin 🆔si:qaysi o'yinchilarni bali(ball kiritishda 2ta o'yinchi bali birga kiritiladi ya'ni 2ta jamodagi bir xil raqamdagi o'yinchilar birga kirtiladi):1-o'yinchi yutgan match soni: durrang match soni:2-o'yinchi yutgan match soni: durrang match soni: \n*Namuna:* \`/result:${games_query.rows[0].id}:1:0:0:0:0\`\n\n🔚*O'yinni yakunlash uchun: /end:o'yin 🆔si \nNamuna:* \`/end:${games_query.rows[0].id}\``,
        {
          reply_markup: { keyboard: await games, resize_keyboard: true },
          parse_mode: "Markdown",
        }
      );
    } else if (!text == false && text.includes("/result")) {
      const text_clear = text.split(":");
      let point =
        text_clear[3] +
        ":" +
        text_clear[4] +
        "/" +
        text_clear[5] +
        ":" +
        text_clear[6];
      if (text_clear[2] == 1) {
        const pointQ = await pool.query(
          `UPDATE games SET point1 = $1 WHERE id= $2;`,
          [point, text_clear[1]]
        );
      }
      if (text_clear[2] == 2) {
        const pointQ = await pool.query(
          `UPDATE games SET point2 = $1 WHERE id= $2;`,
          [point, text_clear[1]]
        );
      }
      if (text_clear[2] == 3) {
        const pointQ = await pool.query(
          `UPDATE games SET point3 = $1 WHERE id= $2;`,
          [point, text_clear[1]]
        );
      }
      let games = getAllGames(pool);
      bot.sendMessage(chatId, `✅*Natija kiritildi.*`, {
        reply_markup: { keyboard: await games, resize_keyboard: true },
        parse_mode: "Markdown",
      });
    } else if (!text == false && text.includes("/end")) {
      const text_clear = text.split(":");
      const gamess = await pool.query(`SELECT * FROM games WHERE id = $1;`, [
        text_clear[1],
      ]);
      let team1 = await pool.query(`SELECT * FROM team WHERE id = $1;`, [
        gamess.rows[0].team1,
      ]);
      let team2 = await pool.query(`SELECT * FROM team WHERE id = $1;`, [
        gamess.rows[0].team2,
      ]);
      let point1 = await calculateResult(gamess.rows[0].point1);
      let point2 = await calculateResult(gamess.rows[0].point2);
      let point3 = await calculateResult(gamess.rows[0].point3);
      if (point1 !== null && point2 !== null && point3 !== null) {
        let endPoin1 = point1[0] + point2[0] + point3[0];
        let endPoin2 = point1[1] + point2[1] + point3[1];
        const resultQ1 = await pool.query(
          `UPDATE team SET points = $1 WHERE id= $2;`,
          [endPoin1, gamess.rows[0].team1]
        );
        const resultQ2 = await pool.query(
          `UPDATE team SET points = $1 WHERE id= $2;`,
          [endPoin2, gamess.rows[0].team2]
        );
        let games = getAllGames(pool);
        bot.sendMessage(
          chatId,
          `🧠*O'yinning yakuniy natijalari:\n\n${team1.rows[0].name}\n1.${team1.rows[0].player1}: ${point1[0]}\n2.${team1.rows[0].player2}: ${point2[0]}\n3.${team1.rows[0].player3}: ${point3[0]}\n\n${team2.rows[0].name}\n1.${team2.rows[0].player1}: ${point1[1]}\n2.${team2.rows[0].player2}: ${point2[1]}\n3.${team2.rows[0].player3}: ${point3[1]}*`,
          {
            reply_markup: { keyboard: await games, resize_keyboard: true },
            parse_mode: "Markdown",
          }
        );
        const endQ = await pool.query(
          `UPDATE games SET ended = true WHERE id = $1;`,
          [text_clear[1]]
        );
      } else {
        let games = getAllGames(pool);
        bot.sendMessage(chatId, "😬*Natijalar kiritilmagan*", {
          reply_markup: { keyboard: await games, resize_keyboard: true },
          parse_mode: "Markdown",
        });
      }

      /////Jamoalar
    } else if (text == "Jamoalar") {
      let group = getAllTeam(pool);
      bot.sendMessage(chatId, "👥*Jamoalar:*", {
        reply_markup: { keyboard: await group, resize_keyboard: true },
        parse_mode: "Markdown",
      });
    } else if (text == "Jamoa qo'shish") {
      bot.sendMessage(
        chatId,
        "❗️<b>Jamoa haqidagi ma'lumotlarni quyidagi foramatda kiriting. Quyidagi formatda: /add_team:Jamoa nomi.Player1.Player2.Player3.Points \n\n⁉️Namuna:</b> /add_team:Chempions.Alex Mullen.Andrea Muzii.Katie Kermode.0",
        {
          reply_markup: { keyboard: cancel, resize_keyboard: true },
          parse_mode: "HTML",
        }
      );
    } else if (!text == false && text.includes("/add_team")) {
      const text_clear = text.split(":")[1];
      const new_team = text_clear.split(".");
      let group = getAllTeam(pool);
      addTeam(new_team[0], new_team[1], new_team[2], new_team[3], new_team[4]);
      bot.sendMessage(chatId, "✅*Jamoa qo'shildi*", {
        reply_markup: { keyboard: await group, resize_keyboard: true },
        parse_mode: "Markdown",
      });
    } else if (!text == false && text.includes("/del_team")) {
      const text_clear = text.split(":")[1];
      const query = await pool.query(`DELETE FROM team WHERE id = $1;`, [
        text_clear,
      ]);
      const query2 = await pool.query(`DELETE FROM games WHERE team1 = $1;`, [
        text_clear,
      ]);
      const query3 = await pool.query(`DELETE FROM games WHERE team2 = $1;`, [
        text_clear,
      ]);
      let group = getAllTeam(pool);
      bot.sendMessage(chatId, "✅*Jamoa o'chirildi*", {
        reply_markup: { keyboard: await group, resize_keyboard: true },
        parse_mode: "Markdown",
      });
    } else if (!text == false && text.includes("/team")) {
      const text_clear = text.split(":");
      const query = await pool.query(`SELECT * FROM team WHERE id = $1;`, [
        text_clear[2],
      ]);
      if (query.rows[0] !== undefined) {
        let group = getAllTeam(pool);
        bot.sendMessage(
          chatId,
          `👥*Jamoa ma'lumotlari:* \n*Nomi: ${query.rows[0].name}, \nO'yinchilar: \n1.${query.rows[0].player1} \n2.${query.rows[0].player2} \n3.${query.rows[0].player3}\nUmumiy hisobda ballari: ${query.rows[0].points}*`,
          {
            reply_markup: { keyboard: await group, resize_keyboard: true },
            parse_mode: "Markdown",
          }
        );
        bot.sendMessage(
          chatId,
          "*Jamoani o'chirish uchun* `/del_team:" + query.rows[0].id + "`",
          {
            reply_markup: { keyboard: await group, resize_keyboard: true },
            parse_mode: "Markdown",
          }
        );
      }
    }
  }
});

//funsiyalar
const addTeam = async (name, player1, player2, player3, points) => {
  const query = await pool.query(
    `INSERT INTO team(name, player1, player2, player3, points) VALUES ($1, $2, $3, $4, $5)`,
    [name, player1, player2, player3, points]
  );
};

const calculateResult = async (point) => {
  let result_array = [];
  if (point !== null) {
    const text_clear = point.split("/");
    let splited1 = text_clear[0].split(":");
    let splited2 = text_clear[1].split(":");
    let result1 = Number(splited1[0]) * 3 + Number(splited1[1]);
    let result2 = Number(splited2[0]) * 3 + Number(splited2[1]);
    result_array.push(result1);
    result_array.push(result2);
    return result_array;
  } else {
    return null;
  }
};
