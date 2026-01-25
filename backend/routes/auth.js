const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const dotenv = require("dotenv");
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

/**
 * SIGNUP
 * POST /api/auth/signup
 */
router.post("/signup", (req, res) => {
  let { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required" });

  name = name.trim();
  email = email.trim().toLowerCase();

  bcrypt.hash(password, 10, (err, hashed) => {
    if (err) return res.status(500).json({ error: "Hashing error" });

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, hashed], (dbErr) => {
      if (dbErr) {
        if (dbErr.code === "ER_DUP_ENTRY")
          return res.status(400).json({ error: "Email already exists" });

        return res.status(500).json({ error: "Database error" });
      }

      res.json({ message: "Signup successful" });
    });
  });
});

/**
 * LOGIN
 * POST /api/auth/login
 */
router.post("/login", (req, res) => {
  let { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email & password are required" });

  email = email.trim().toLowerCase();

  const sql = "SELECT * FROM users WHERE email = ? LIMIT 1";

  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (!results.length) return res.status(400).json({ error: "User not found" });

    const user = results[0];

    bcrypt.compare(password, user.password, (cErr, match) => {
      if (cErr) return res.status(500).json({ error: "Error verifying password" });

      if (!match) return res.status(400).json({ error: "Incorrect password" });

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    });
  });
});

module.exports = router;
