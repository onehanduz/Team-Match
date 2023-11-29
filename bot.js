const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const dotenv = require("dotenv").config();
let {
  main,
  cancel,
  diceplines,
  getAllTeam,
  getAllGames,
} = require("./src/key/keyArray");
const token = process.env.BOT_TOKEN;
const pool = require("./src/db");
const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;
  const fromId = msg.from.id;
  const groupId = "-4140303207";
  const admin1 = "863638300";
  const admin2 = "568063499";
  const admin3 = "1314213542";

  if (
    (chatId == groupId &&
      (fromId == admin1 || fromId == admin2 || fromId == admin3)) ||
    chatId == admin1 ||
    chatId == admin2 ||
    chatId == admin3
  ) {
    if (text == "/start" || text == "Qaytish") {
      if (chatId == groupId) {
        bot.sendMessage(chatId, "*Running*", {
          reply_markup: { remove_keyboard: true },
          parse_mode: "Markdown",
        });
      } else {
        bot.sendMessage(chatId, "*Bosh menu*", {
          reply_markup: { keyboard: main, resize_keyboard: true },
          parse_mode: "Markdown",
        });
      }
    } else if (text == "Buyruqlar" || text == "/commands") {
      bot.sendMessage(
        chatId,
        "*Hamma buyruqlar⤵️:\n\n/games - Tugatilmagan o'yinlarni ko'rish uchun\n/create_game - O'yin yaratish uchun ma'lumotlar\n/add_game:ID:ID - O'yin qo'shish uchun\n/game:Team🆚Team:ID - 1ta o'yinni ko'rish uchun\n/result:ID:Number:Number:Number:Number:Number:Number - natijalarni kiritish\n/end:ID - O'yinni tugatish\n/all_team - Hamma jamoalarni ko'rish\n/create_team - Jamoa qo'shish haqida ma'lumot\n/add_team:Text.Text.Text.Text - Jamoa qo'shish\n/del_team:ID - Jamoani o'chirish\n/team:Text:ID - Jamoani ko'rish*",
        {
          parse_mode: "Markdown",
        }
      );
      //O'yinlar
    } else if (text == "O'yinlar" || text == "/games") {
      if (chatId == groupId) {
        const query = await pool.query(
          "SELECT * FROM games WHERE ended=FALSE;"
        );
        let data = "*Tugamagan o'yinlar*⤵️:";
        if (query.rowCount !== 0) {
          for (const iterator of query.rows) {
            query1 = await pool.query("SELECT * FROM team WHERE id = $1;", [
              iterator.team1,
            ]);
            query2 = await pool.query("SELECT * FROM team WHERE id = $1;", [
              iterator.team2,
            ]);
            if (query1.rowCount !== 0 && query2.rowCount !== 0) {
              data =
                data +
                "\n" +
                "`/game:" +
                query1.rows[0].name +
                "🆚" +
                query2.rows[0].name +
                ":" +
                iterator.id +
                "`";
            }
          }
        }
        bot.sendMessage(chatId, data, {
          parse_mode: "Markdown",
        });
      } else {
        let games = getAllGames(pool);
        bot.sendMessage(chatId, "*Tugamagan o'yinlar*⤵️:", {
          reply_markup: { keyboard: await games, resize_keyboard: true },
          parse_mode: "Markdown",
        });
      }
    } else if (text == "O'yin yaratish" || text == "/create_game") {
      const query = await pool.query("SELECT * FROM team");
      let data = "*Jamoalar*⤵️:";
      for (const iterator of query.rows) {
        data =
          data + `\n\n👥*Nomi*:${iterator.name}\n🆔:\`\`${iterator.id}\`\``;
      }
      if (chatId == groupId) {
        bot.sendMessage(
          chatId,
          data +
            "\n\n📃*Yo'nalishlar*: 7-Random\n\n❗️*O'yin qo'shish uchun: /add_game:1-jamoa 🆔si:2-jamoa 🆔si:yo'nalish raqami*\n\n⁉️*Namuna:* `/add_game:1:2:7`",
          {
            parse_mode: "Markdown",
          }
        );
      } else {
        bot.sendMessage(
          chatId,
          data +
            "\n\n📃*Yo'nalishlar*: 7-Random\n\n❗️*O'yin qo'shish uchun: /add_game:1-jamoa 🆔si:2-jamoa 🆔si:yo'nalish raqami*\n\n⁉️*Namuna:* `/add_game:1:2:7`",
          {
            reply_markup: { keyboard: main, resize_keyboard: true },
            parse_mode: "Markdown",
          }
        );
      }
    } else if (!text == false && text.includes("/add_game")) {
      const text_clear = text.split(":");
      if (text_clear.length == 4 && text_clear[3] == 7) {
        let query_team1 = await pool.query(
          `SELECT * FROM team WHERE id = $1;`,
          [text_clear[1]]
        );
        let query_team2 = await pool.query(
          `SELECT * FROM team WHERE id = $1;`,
          [text_clear[2]]
        );
        if (query_team1.rowCount !== 0 && query_team2.rowCount !== 0) {
          const query = await pool.query(
            `INSERT INTO games(team1, team2) VALUES ($1, $2);`,
            [text_clear[1], text_clear[2]]
          );
          let gamess = "🧠*O'yin*: \n\n";
          if (text_clear[3] == "7") {
            gamess =
              gamess +
              "*1." +
              query_team1.rows[0].player1 +
              " 🆚 " +
              query_team2.rows[0].player1 +
              " " +
              diceplines[Math.floor(Math.random() * 6)] +
              "\n2." +
              query_team1.rows[0].player1 +
              " 🆚 " +
              query_team2.rows[0].player2 +
              " " +
              diceplines[Math.floor(Math.random() * 6)] +
              "\n3." +
              query_team1.rows[0].player1 +
              " 🆚 " +
              query_team2.rows[0].player3 +
              " " +
              diceplines[Math.floor(Math.random() * 6)] +
              "\n4." +
              query_team1.rows[0].player2 +
              " 🆚 " +
              query_team2.rows[0].player1 +
              " " +
              diceplines[Math.floor(Math.random() * 6)] +
              "\n5." +
              query_team1.rows[0].player2 +
              " 🆚 " +
              query_team2.rows[0].player2 +
              " " +
              diceplines[Math.floor(Math.random() * 6)] +
              "\n6." +
              query_team1.rows[0].player2 +
              " 🆚 " +
              query_team2.rows[0].player3 +
              " " +
              diceplines[Math.floor(Math.random() * 6)] +
              "\n7." +
              query_team1.rows[0].player3 +
              " 🆚 " +
              query_team2.rows[0].player1 +
              " " +
              diceplines[Math.floor(Math.random() * 6)] +
              "\n8." +
              query_team1.rows[0].player3 +
              " 🆚 " +
              query_team2.rows[0].player2 +
              " " +
              diceplines[Math.floor(Math.random() * 6)] +
              "\n9." +
              query_team1.rows[0].player3 +
              " 🆚 " +
              query_team2.rows[0].player3 +
              " " +
              diceplines[Math.floor(Math.random() * 6)] +
              "\n" +
              "*";
          }
          if (chatId == groupId) {
            bot.sendMessage(chatId, gamess, {
              parse_mode: "Markdown",
            });
          } else {
            let games = getAllGames(pool);
            bot.sendMessage(chatId, gamess, {
              reply_markup: { keyboard: await games, resize_keyboard: true },
              parse_mode: "Markdown",
            });
          }
        } else {
          if (chatId == groupId) {
            bot.sendMessage(chatId, "❌*Bunday jamoalar topilmadi.*", {
              parse_mode: "Markdown",
            });
          } else {
            let games = getAllGames(pool);
            bot.sendMessage(chatId, "❌*Bunday jamoalar topilmadi.*", {
              reply_markup: { keyboard: await games, resize_keyboard: true },
              parse_mode: "Markdown",
            });
          }
        }
      } else {
        bot.sendMessage(chatId, "❌*Xato.*", {
          parse_mode: "Markdown",
        });
      }
    } else if (!text == false && text.includes("/game")) {
      const text_clear = text.split(":");
      const games_query = await pool.query(
        `SELECT * FROM games WHERE id = $1;`,
        [text_clear[2]]
      );
      if (games_query.rowCount !== 0) {
        const team1 = await pool.query(`SELECT * FROM team WHERE id = $1;`, [
          games_query.rows[0].team1,
        ]);
        const team2 = await pool.query(`SELECT * FROM team WHERE id = $1;`, [
          games_query.rows[0].team2,
        ]);
        if (team1.rowCount !== 0 && team2.rowCount !== 0) {
          if (chatId == groupId) {
            bot.sendMessage(
              chatId,
              `🧠*O'yin* 🆔: ${games_query.rows[0].id}\n👥*Jamoalar haqida ma'lumot:* \n\n *${team1.rows[0].name} \n1.${team1.rows[0].player1}\n2.${team1.rows[0].player2}\n3.${team1.rows[0].player3}\n\n${team2.rows[0].name} \n1.${team2.rows[0].player1}\n2.${team2.rows[0].player2}\n3.${team2.rows[0].player3}*\n\n*Natijalarni kiritish uchun:* /result:o'yin 🆔si:qaysi o'yinchilarni bali(ball kiritishda 2ta o'yinchi bali birga kiritiladi ya'ni 2ta jamodagi bir xil raqamdagi o'yinchilar birga kirtiladi):1-o'yinchi yutgan match soni: durrang match soni:2-o'yinchi yutgan match soni: durrang match soni: \n*Namuna:* \`/result:${games_query.rows[0].id}:1:0:0:0:0\`\n\n🔚*O'yinni yakunlash uchun: /end:o'yin 🆔si \nNamuna:* \`/end:${games_query.rows[0].id}\``,
              {
                parse_mode: "Markdown",
              }
            );
          } else {
            let games = getAllGames(pool);
            bot.sendMessage(
              chatId,
              `🧠*O'yin* 🆔: ${games_query.rows[0].id}\n👥*Jamoalar haqida ma'lumot:* \n\n *${team1.rows[0].name} \n1.${team1.rows[0].player1}\n2.${team1.rows[0].player2}\n3.${team1.rows[0].player3}\n\n${team2.rows[0].name} \n1.${team2.rows[0].player1}\n2.${team2.rows[0].player2}\n3.${team2.rows[0].player3}*\n\n*Natijalarni kiritish uchun:* /result:o'yin 🆔si:qaysi o'yinchilarni bali(ball kiritishda 2ta o'yinchi bali birga kiritiladi ya'ni 2ta jamodagi bir xil raqamdagi o'yinchilar birga kirtiladi):1-o'yinchi yutgan match soni: durrang match soni:2-o'yinchi yutgan match soni: durrang match soni: \n*Namuna:* \`/result:${games_query.rows[0].id}:1:0:0:0:0\`\n\n🔚*O'yinni yakunlash uchun: /end:o'yin 🆔si \nNamuna:* \`/end:${games_query.rows[0].id}\``,
              {
                reply_markup: { keyboard: await games, resize_keyboard: true },
                parse_mode: "Markdown",
              }
            );
          }
        }
      }
    } else if (!text == false && text.includes("/result")) {
      const text_clear = text.split(":");
      if (text_clear.length == 7) {
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
        bot.sendMessage(chatId, `✅*Natija kiritildi.*`, {
          parse_mode: "Markdown",
        });
      } else {
        bot.sendMessage(chatId, `❌*Natija kiritishda xatolik.*`, {
          parse_mode: "Markdown",
        });
      }
    } else if (!text == false && text.includes("/end")) {
      const text_clear = text.split(":");
      const gamess = await pool.query(
        `SELECT * FROM games WHERE id = $1 AND ended=FALSE;`,
        [text_clear[1]]
      );
      if (gamess.rowCount !== 0) {
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
          let team1Points = await pool.query(
            `SELECT points FROM team WHERE id = $1;`,
            [gamess.rows[0].team1]
          );
          let team2Points = await pool.query(
            `SELECT points FROM team WHERE id = $1;`,
            [gamess.rows[0].team2]
          );
          let endPoin1 =
            point1[0] +
            point2[0] +
            point3[0] +
            parseInt(await team1Points.rows[0].points);
          let endPoin2 =
            point1[1] +
            point2[1] +
            point3[1] +
            parseInt(await team2Points.rows[0].points);
          const resultQ1 = await pool.query(
            `UPDATE team SET points = $1 WHERE id= $2;`,
            [parseInt(endPoin1), gamess.rows[0].team1]
          );
          const resultQ2 = await pool.query(
            `UPDATE team SET points = $1 WHERE id= $2;`,
            [parseInt(endPoin2), gamess.rows[0].team2]
          );
          let games = getAllGames(pool);
          bot.sendMessage(
            chatId,
            `🧠*O'yinning yakuniy natijalari:\n\n${team1.rows[0].name}\n1.${team1.rows[0].player1}: ${point1[0]}\n2.${team1.rows[0].player2}: ${point2[0]}\n3.${team1.rows[0].player3}: ${point3[0]}\n\n${team2.rows[0].name}\n1.${team2.rows[0].player1}: ${point1[1]}\n2.${team2.rows[0].player2}: ${point2[1]}\n3.${team2.rows[0].player3}: ${point3[1]}*`,
            {
              parse_mode: "Markdown",
            }
          );
          const endQ = await pool.query(
            `UPDATE games SET ended = TRUE WHERE id = $1;`,
            [text_clear[1]]
          );
        } else {
          bot.sendMessage(chatId, "😬*Natijalar kiritilmagan*", {
            parse_mode: "Markdown",
          });
        }
      } else {
        bot.sendMessage(
          chatId,
          "😬*Bunday o'yin topilmadi, tugatilgan yoki ID xato kiritildi. O'yinni qayta natija kiritiladigan qilish uchun /open:O'yin IDsini kiriting \nNamuna: *`/open:1`",
          {
            parse_mode: "Markdown",
          }
        );
      }
    } else if (!text == false && text.includes("/open")) {
      const text_clear = text.split(":");
      const gamess = await pool.query(
        `SELECT * FROM games WHERE id = $1 AND ended=TRUE;`,
        [text_clear[1]]
      );
      if (gamess.rowCount !== 0) {
        const endQ = await pool.query(
          `UPDATE games SET ended = FALSE WHERE id = $1;`,
          [text_clear[1]]
        );
        bot.sendMessage(chatId, "✅*O'yin ochildi.*", {
          parse_mode: "Markdown",
        });
      } else {
        bot.sendMessage(
          chatId,
          "😬*Bunday o'yin topilmadi, tugatilmagan yoki ID xato kiritildi.*",
          {
            parse_mode: "Markdown",
          }
        );
      }

      /////Jamoalar
    } else if (text == "Jamoalar" || text == "/all_team") {
      if (chatId == groupId) {
        let query = await pool.query("SELECT * FROM team;");
        let data = "👥*Jamoalar:*";
        for (const iterator of query.rows) {
          data = data + "\n`/team:" + iterator.name + ":" + iterator.id + "`";
        }
        bot.sendMessage(chatId, data, {
          parse_mode: "Markdown",
        });
      } else {
        let group = getAllTeam(pool);
        bot.sendMessage(chatId, "👥*Jamoalar:*", {
          reply_markup: { keyboard: await group, resize_keyboard: true },
          parse_mode: "Markdown",
        });
      }
    } else if (text == "Jamoa qo'shish" || text == "/create_team") {
      bot.sendMessage(
        chatId,
        "❗️<b>Jamoa haqidagi ma'lumotlarni quyidagi foramatda kiriting. Quyidagi formatda: /add_team:Jamoa nomi.Player1.Player2.Player3.Points \n\n⁉️Namuna:</b> /add_team:Chempions.Alex Mullen.Andrea Muzii.Katie Kermode.0",
        {
          parse_mode: "HTML",
        }
      );
    } else if (!text == false && text.includes("/add_team")) {
      const text_clear = text.split(":")[1];
      const new_team = text_clear.split(".");
      if (new_team.length == 5) {
        addTeam(
          new_team[0],
          new_team[1],
          new_team[2],
          new_team[3],
          new_team[4]
        );
        bot.sendMessage(chatId, "✅*Jamoa qo'shildi*", {
          parse_mode: "Markdown",
        });
      }
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
        parse_mode: "Markdown",
      });
    } else if (!text == false && text.includes("/team")) {
      const text_clear = text.split(":");
      const query = await pool.query(`SELECT * FROM team WHERE id = $1;`, [
        text_clear[2],
      ]);
      if (query.rowCount !== 0) {
        bot.sendMessage(
          chatId,
          `👥*Jamoa ma'lumotlari:* \n*Nomi: ${query.rows[0].name}, \nO'yinchilar: \n1.${query.rows[0].player1} \n2.${query.rows[0].player2} \n3.${query.rows[0].player3}\n\nUmumiy hisobda ballari: ${query.rows[0].points}*`,
          {
            parse_mode: "Markdown",
          }
        );
        bot.sendMessage(
          chatId,
          "*Jamoani o'chirish uchun* `/del_team:" + query.rows[0].id + "`",
          {
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
