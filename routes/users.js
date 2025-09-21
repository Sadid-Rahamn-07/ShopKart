const express = require('express');
const router = express.Router();
const db = require('../db'); // promise pool

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Fetch user by username
    const [rows] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.json({ success: false, error: "Invalid username or password" });
    }

    const user = rows[0];

    // Check password (plain text example)
    if (user.password !== password) {
      return res.json({ success: false, error: "Invalid username or password" });
    }

    // Success
    req.session.username = username;
    res.json({ success: true, userId: user.id, username: user.username });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if email exists
    const [existing] = await db.query("SELECT * FROM users WHERE username = ?", [name]);

    if (existing.length > 0) {
      return res.json({ success: false, error: "username already registered" });
    }

    // Insert new user
    const [result] = await db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );

    // Respond with success
    res.json({ success: true, userId: result.insertId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

router.get('/get_username', async (req, res) => {
  if (req.session && req.session.username) {
    res.json({ username: req.session.username });
  } else {
    res.json({ username: null });
  }
});
module.exports = router;
