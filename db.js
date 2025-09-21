const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'ShopKart',
    waitForConnections: 10,
    queueLimit: 0
});