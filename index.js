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

// =====================
// DEPARTMENTS
// =====================
app.get("/departments", async (req, res) => {
  const result = await pool.query("SELECT * FROM departments");
  res.json(result.rows);
});

// =====================
// DOCTORS
// =====================
app.get("/doctors", async (req, res) => {
  const result = await pool.query("SELECT * FROM doctors");
  res.json(result.rows);
});

// =====================
// PATIENTS
// =====================
app.get("/patients", async (req, res) => {
  const result = await pool.query("SELECT * FROM patients");
  res.json(result.rows);
});

// =====================
// NURSES
// =====================
app.get("/nurses", async (req, res) => {
  const result = await pool.query("SELECT * FROM nurses");
  res.json(result.rows);
});

// =====================
// ROOMS
// =====================
app.get("/rooms", async (req, res) => {
  const result = await pool.query("SELECT * FROM rooms");
  res.json(result.rows);
});

// =====================
// ADMISSIONS
// =====================
app.get("/admissions", async (req, res) => {
  const result = await pool.query("SELECT * FROM admissions");
  res.json(result.rows);
});

// =====================
// APPOINTMENTS
// =====================
app.get("/appointments", async (req, res) => {
  const result = await pool.query("SELECT * FROM appointments");
  res.json(result.rows);
});

// =====================
// PRESCRIPTIONS
// =====================
app.get("/prescriptions", async (req, res) => {
  const result = await pool.query("SELECT * FROM prescriptions");
  res.json(result.rows);
});

// =====================
// MEDICINES
// =====================
app.get("/medicines", async (req, res) => {
  const result = await pool.query("SELECT * FROM medicines");
  res.json(result.rows);
});

// =====================
// PRESCRIPTION MEDICINES
// =====================
app.get("/prescription-medicines", async (req, res) => {
  const result = await pool.query("SELECT * FROM prescription_medicines");
  res.json(result.rows);
});

// =====================
// LAB TESTS
// =====================
app.get("/lab-tests", async (req, res) => {
  const result = await pool.query("SELECT * FROM lab_tests");
  res.json(result.rows);
});

// =====================
// BILLS
// =====================
app.get("/bills", async (req, res) => {
  const result = await pool.query("SELECT * FROM bills");
  res.json(result.rows);
});

// =====================
// PAYMENTS
// =====================
app.get("/payments", async (req, res) => {
  const result = await pool.query("SELECT * FROM payments");
  res.json(result.rows);
});

// =====================
// EMERGENCY CASES
// =====================
app.get("/emergency-cases", async (req, res) => {
  const result = await pool.query("SELECT * FROM emergency_cases");
  res.json(result.rows);
});

// =====================
// INVENTORY
// =====================
app.get("/inventory", async (req, res) => {
  const result = await pool.query("SELECT * FROM inventory");
  res.json(result.rows);
});