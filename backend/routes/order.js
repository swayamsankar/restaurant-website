const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * POST /api/order
 * body: { items: [...], total }
 * Protected: requires Authorization: Bearer <token>
 */
router.post("/", auth, (req, res) => {
  const userId = req.userId;
  const { items, total } = req.body;
  if (!items || !total) return res.status(400).json({ error: "Missing order data" });

  const sql = "INSERT INTO orders (user_id, items, total) VALUES (?, ?, ?)";
  db.query(sql, [userId, JSON.stringify(items), total], (err, result) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json({ message: "Order placed", orderId: result.insertId });
  });
});

module.exports = router;
