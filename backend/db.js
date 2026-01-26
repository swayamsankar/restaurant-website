const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: true }
});

db.getConnection((err, conn) => {
  if (err) {
    console.error("DB ERROR:", err.message);
  } else {
    console.log("DB CONNECTED");
    conn.release();
  }
});

module.exports = db;
