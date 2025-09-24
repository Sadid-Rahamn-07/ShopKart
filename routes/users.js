const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const db = require('../db'); // promise pool

// profile pic folder path
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile_img'); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    cb(null, `${req.session.username}_${Date.now()}.${ext}`);
  }
});

//product image folder path
const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products'); // separate folder for product images
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    cb(null, `${req.session.username}_product_${Date.now()}.${ext}`);
  }
});

const uploadProduct = multer({ storage: productStorage });
const upload = multer({ storage });

//login router
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

//signup router
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

//update user info
router.put('/update', upload.single('profile_photo'), async (req, res) => {
  if (!req.session.username) {
    // delete uploaded file if exists
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(401).json({ success: false, message: 'Not logged in' });
  }

  const { username, email, address, phone, gender, year, month, day } = req.body;
  const dob = `${year}-${month}-${day}`;

  let profileImagePath = null;
  if (req.file) profileImagePath = `/uploads/profile_img/${req.file.filename}`;

  try {
    const sql = `
      UPDATE users
      SET username=?, email=?, address=?, phone=?, gender=?, dob=?${profileImagePath ? ', profile_image=?' : ''}
      WHERE username=?`;

    const params = profileImagePath
      ? [username, email, address, phone, gender, dob, profileImagePath, req.session.username]
      : [username, email, address, phone, gender, dob, req.session.username];

    await db.query(sql, params);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    // delete uploaded file on DB error
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

//logout
router.post('/logout', async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    res.clearCookie('connect.sid'); // clear session cookie
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

//fetch username
router.get('/get_username', async (req, res) => {
  if (req.session && req.session.username) {
    res.json({ success: true, username: req.session.username });
  } else {
    res.json({ success: false, username: null });
  }
});

//upload product
router.post('/postProduct', uploadProduct.single('img'), async (req, res) => {
  try {
    const { title, category, price, description } = req.body;
    const img = req.file ? req.file.filename : null; // uploaded file name

    // Validate required fields
    if (!title || !category || !price) {
      // delete uploaded file if exists
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const username = req.session.username;
    const [rows] = await db.query(
      "SELECT id FROM users WHERE username = ?", [username]
    );

    if (!rows.length) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const user_id = rows[0].id;

    const [result] = await db.query(
      "INSERT INTO product (user_id, title, category, price, description, product_image) VALUES (?, ?, ?, ?, ?, ?)",
      [user_id, title, category, price, description, img]
    );

    res.json({ success: true, productId: result.insertId });

  } catch (err) {
    console.error(err);
    // delete uploaded file on any server error
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// fetch user profile picture
router.get('/get_userPic', async (req, res) => {
  if (!req.session.username) {
    return res.status(401).json({ success: false, error: "Not logged in" });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [req.session.username]
    );

    if (rows.length === 0) {
      return res.json({ success: false, error: "User not found" });
    }

    res.json({ success: true, profile_image: rows[0].profile_image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

//fetch all products internal used in the home page
router.get('/get_products', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.username AS seller_name,
        p.id,
        p.title, 
        p.category, 
        p.price, 
        p.description, 
        p.product_image, 
        p.created_at
      FROM product AS p
      JOIN users AS u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);

    res.json({
      success: true,
      products: rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

//used in the sale page
router.get('/getUserProducts', async (req, res) => {
  try {
    const username = req.session.username;
    const [rw] = await db.query(
      "SELECT id FROM users WHERE username = ?", [username]
    );
    const user_id = rw[0].id;
    const [rows] = await db.query("SELECT * FROM product WHERE user_id = ?", [user_id]);
    res.json({
      success: true,
      username: username,
      products: rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

module.exports = router;
