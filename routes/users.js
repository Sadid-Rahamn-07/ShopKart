var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET users listing. */
router.post('/', function (req, res, next) {
  //res.send('respond with a resource');
  const { name, email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email])
    .then(([existing]) => {
      if (existing.length > 0) {
        return res.json({ success: false, error: "Email already registered" });
      }

      // Insert new user
      return db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, password]
      );
    })
    .then(([result]) => {
      if (result) {
        res.json({ success: true, userId: result.insertId });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ success: false, error: "Database error" });
    });
});

module.exports = router;
