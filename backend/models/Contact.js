const db = require('../db');

const Contact = {
    create: (data, callback) => {
        const query = 'INSERT INTO Contact (name, email, message) VALUES (?, ?, ?)';
        db.query(query, [data.name, data.email, data.message], callback);
    }
};

module.exports = Contact;
