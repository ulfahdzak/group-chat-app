const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  password: "",
  user: "root",
  database: "group_chat_app",
  multipleStatements: true,
});

module.exports = db;
