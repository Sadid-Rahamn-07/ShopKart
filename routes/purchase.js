var express = require('express');
var router = express.Router();
const db = require('../db'); // promise pool

//gets called from the home.js -> load() function
router.post("/order", async (req, res) => {
    try {
        const { productId } = req.body;
        const username = req.session.username;

        if (!productId) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        if (!username) {
            return res.status(401).json({ success: false, message: "User not logged in" });
        }

        // Get user ID from username
        const [rows] = await db.query(
            "SELECT id FROM users WHERE username = ?",
            [username]
        );

        const [productInfo] = await db.query(
            "SELECT * FROM product WHERE id = ?",
            [productId]
        );

        if (!rows.length) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const product = productInfo[0]; // first product object

        const userId = rows[0].id;

        // Insert order
        // Insert order
        const [result] = await db.query(
            `INSERT INTO orders (user_id, product_id) VALUES (?, ?)`,
            [userId, productId]
        );

        res.json({ success: true, orderId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

router.get('/getOrdersInfo', async (req, res) => {
    try {
        const username = req.session.username;
        if (!username) {
            return res.status(401).json({ success: false, message: "Not logged in" });
        }

        // Get the user id
        const [rows] = await db.query(
            'SELECT id FROM users WHERE username = ?',
            [username]
        );

        if (!rows.length) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const userId = rows[0].id;

        // Get orders info
        const [results] = await db.query(
            `SELECT 
                orders.id AS order_id,
                orders.user_id AS seller_id, 
                seller.username AS seller_name,
                product.title, 
                product.category, 
                product.price, 
                product.description, 
                product.product_image, 
                orders.created_at AS order_date
            FROM orders
            JOIN users ON orders.user_id = users.id      
            JOIN product ON orders.product_id = product.id
            JOIN users AS seller ON product.user_id = seller.id 
            WHERE users.id = ?`,
            [userId]
        );

        res.json({ success: true, orders: results });
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post('/cancelOrder', async (req, res) => {
    try {
        const { orderID } = req.body;

        await db.query('DELETE FROM orders WHERE id = ?', [orderID]);

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

//fetch pending reviews
router.get('/getPendingReviews', async (req, res) => {
    try {
        const username = req.session.username;
        if (!username) {
            return res.status(401).json({ success: false, message: "Not logged in" });
        }

        const [userRows] = await db.query("SELECT id FROM users WHERE username = ?", [username]);
        if (userRows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const userID = userRows[0].id;

        // Fetch pending reviews
        const [reviewRows] = await db.query(
            "SELECT * FROM reviews WHERE customer_id = ? AND status = ?",
            [userID, 'pending']
        );

        res.json({ success: true, review_items: reviewRows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// submit review
router.post('/review', async (req, res) => {
    try {
        const username = req.session.username; // no destructuring

        if (!username) {
            return res.status(401).json({ success: false, message: "Not logged in" });
        }

        const { reviews_id, rating, comments } = req.body;

        if (!reviews_id || !rating) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
        // Get user id
        const [userRows] = await db.query(
            "SELECT id FROM users WHERE username = ?",
            [username]
        );

        if (!userRows.length) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Insert review
        const [result] = await db.query(
            "UPDATE reviews SET comments = ?, rating = ?, status = ? WHERE id = ?",
            [comments || '', rating, 'completed', reviews_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        res.json({ success: true });

    } catch (err) {
        console.error("Error saving review:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post('/placeOrder', async (req, res) => {
    try {
        const { orderID } = req.body;
        const username = req.session.username; // fixed

        // Get product ID from order
        const [rows] = await db.query(
            `SELECT product_id FROM orders WHERE id = ?`,
            [orderID]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Get user (customer)
        const [userRows] = await db.query(
            `SELECT id FROM users WHERE username = ?`,
            [username]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const productId = rows[0].product_id;
        const userID = userRows[0].id;

        // Get product details
        const [productInfoRows] = await db.query(
            `SELECT * FROM product WHERE id = ?`,
            [productId]
        );

        if (productInfoRows.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const productInfo = productInfoRows[0];

        // Insert into reviews
        await db.query(
            `
                INSERT INTO reviews 
                (customer_id, seller_id, product_title, product_category, product_price, product_description, product_image) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                userID,
                productInfo.user_id,
                productInfo.title,
                productInfo.category,
                productInfo.price,
                productInfo.description,
                productInfo.product_image
            ]
        );

        // Delete the product
        const [result] = await db.query(
            `DELETE FROM product WHERE id = ?`,
            [productId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.json({ success: true, message: "Order confirmed and product deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});







module.exports = router;


