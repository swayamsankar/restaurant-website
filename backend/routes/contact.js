const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

router.post('/', (req, res) => {
    Contact.create(req.body, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json({ message: 'Message received!' });
    });
});

module.exports = router;
