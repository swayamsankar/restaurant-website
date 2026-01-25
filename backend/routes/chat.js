const express = require("express");
const { OpenAI } = require("openai");
const dotenv = require("dotenv");
dotenv.config();

const router = express.Router();

const openaiKey = process.env.OPENAI_API_KEY;
if (!openaiKey) {
  console.warn("OPENAI_API_KEY not set — chat endpoint will fail until provided.");
}
const client = new OpenAI({ apiKey: openaiKey });

/**
 * POST /api/chat
 * body: { message }
 * Returns { reply }
 */
router.post("/", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Missing message" });

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",   // change model if necessary
      messages: [{ role: "user", content: message }],
      max_tokens: 600
    });

    const reply = response.choices?.[0]?.message?.content ?? "No reply";
    res.json({ reply });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "AI service error" });
  }
});

module.exports = router;
