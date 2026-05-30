const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Neon DB Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Test DB connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.log("❌ DB Error:", err.message);
  } else {
    console.log("✅ Neon DB Connected:", res.rows[0].now);
  }
});

// Home route
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Hospital Backend Running 🚀",
      time: result.rows[0].now
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper function for tables
const getTable = (table) => async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM ${table}`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ALL ROUTES
app.get("/departments", getTable("departments"));
app.get("/doctors", getTable("doctors"));
app.get("/patients", getTable("patients"));
app.get("/nurses", getTable("nurses"));
app.get("/rooms", getTable("rooms"));
app.get("/admissions", getTable("admissions"));
app.get("/appointments", getTable("appointments"));
app.get("/prescriptions", getTable("prescriptions"));
app.get("/medicines", getTable("medicines"));
app.get("/prescription-medicines", getTable("prescription_medicines"));
app.get("/lab-tests", getTable("lab_tests"));
app.get("/bills", getTable("bills"));
app.get("/payments", getTable("payments"));
app.get("/emergency-cases", getTable("emergency_cases"));
app.get("/inventory", getTable("inventory"));

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});