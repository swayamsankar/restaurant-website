const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');

router.post('/', (req, res) => {
    Reservation.create(req.body, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json({ message: 'Reservation saved!' });
    });
});

module.exports = router;
