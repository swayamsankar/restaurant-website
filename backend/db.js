const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // your MySQL username
    password: 'Swayam#2004', // your MySQL password
    database: 'restaurantDB' // make sure to create this DB
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database!');
});

module.exports = db;
