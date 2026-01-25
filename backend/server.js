const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// ⭐ Load environment variables BEFORE loading routes
dotenv.config();

// ⭐ Connect to MySQL
require("./db");

// ⭐ Import Routes AFTER dotenv is loaded
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const orderRoutes = require("./routes/order");
const menuRoutes = require("./routes/menu");

const app = express();

// ⭐ Middlewares
app.use(cors());
app.use(express.json()); // Parses JSON requests

// ⭐ Health Check
app.get("/", (req, res) => {
  res.send("Restaurant API running");
});

// ⭐ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/menu", menuRoutes);

// ⭐ OPTIONAL: Serve frontend (disabled unless needed)
// app.use(express.static(path.join(__dirname, "..", "frontend")));

// ⭐ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
