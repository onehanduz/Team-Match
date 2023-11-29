const pool = require("../db");
const fs = require("fs");

const main = [["O'yinlar", "O'yin yaratish"], ["Jamoalar"]];
const cancel = [["Qaytish"]];

const diceplines = [
  "9️⃣Numbers",
  "🃏Cards",
  "🗾Images",
  "👨‍🦰Names",
  "🧕🏿🧔🏽‍♂️International names",
  "🔤Words",
];
//Jamoalar
let getAllTeam = async (pool) => {
  let query = await pool.query("SELECT * FROM team;");
  let arr = [];
  for (const iterator of query.rows) {
    arr.push(["/team:" + iterator.name + ":" + iterator.id]);
  }
  arr.push(["Jamoa qo'shish"]);
  arr.push(["Qaytish"]);
  return arr;
};

const getAllGames = async (pool) => {
  const query = await pool.query("SELECT * FROM games WHERE ended=FALSE;");
  let data = "Qaytish";
  let query1;
  let query2;
  let arr = [];
  if (query.rowCount !== 0) {
    for (const iterator of query.rows) {
      query1 = await pool.query("SELECT * FROM team WHERE id = $1;", [
        iterator.team1,
      ]);
      query2 = await pool.query("SELECT * FROM team WHERE id = $1;", [
        iterator.team2,
      ]);
      if (query1.rowCount !== 0 && query2.rowCount !== 0) {
        arr.push([
          "/game:" +
            query1.rows[0].name +
            "🆚" +
            query2.rows[0].name +
            ":" +
            iterator.id,
        ]);
      }
    }
  }
  arr.push([data]);
  return arr;
};

module.exports = {
  main,
  cancel,
  diceplines,
  getAllTeam,
  getAllGames,
};
