const mysql = require('mysql2/promise'); // note the /promise

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'yourpassword',
    database: 'ShopKart',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
