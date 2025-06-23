const db = require('../db');

const MenuItem = {
    getAll: (callback) => {
        db.query('SELECT * FROM MenuItem', callback);
    }
};

module.exports = MenuItem;
