const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

router.get('/', async (req, res) => {
    try {
        // Assuming MenuItem.getAll is callback-based, we wrap it in a Promise
        // for cleaner async/await syntax.
        const results = await new Promise((resolve, reject) => {
            MenuItem.getAll((err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
        res.json(results);
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ error: 'Failed to retrieve menu items', details: error.message });
    }
});

module.exports = router;
