const db = require('../db');

const Reservation = {
    create: (data, callback) => {
        const query = 'INSERT INTO Reservation (name, email, phone, date, time, guests) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(query, [data.name, data.email, data.phone, data.date, data.time, data.guests], callback);
    }
};

module.exports = Reservation;
