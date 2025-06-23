const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

router.get('/', (req, res) => {
    MenuItem.getAll((err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json(results);
    });
});

module.exports = router;
