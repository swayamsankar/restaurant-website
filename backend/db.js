const mysql = require("mysql2");
require("dotenv").config(); // load .env variables

const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Swayam#2004",
    database: process.env.DB_NAME || "restaurantdb",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection
db.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Error connecting to MySQL:", err);
        return;
    }
    console.log("✅ MySQL connection pool ready!");
    connection.release();
});

module.exports = db;
