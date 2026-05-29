const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) console.log("DB Error:", err.message);
  else console.log("Neon DB Connected ✅", res.rows[0].now);
});

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send("Connected to Neon! Time: " + result.rows[0].now);
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
