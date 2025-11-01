# ShopKart
## Description
Our platform is an online marketplace where customers can easily buy and sell products. Users can list items for sale, browse a wide variety of products, and make secure transactions all in one place. Designed for convenience and reliability, the website connects buyers and sellers, making shopping and selling simple, fast, and safe.

## Setup Instructions
### Prerequisites
- Node.js (v18+)
- npm
- MySQL2 server
- (Optional) `make` on Unix-like systems
- `.env` file in project root with the following variables:
  ```dotenv
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=root
  DB_NAME=bookstore
  ```
- The default password for `root` is `root`.

- Clone the repository and navigate into the project directory:
   ```bash
   git clone https://github.com/UAdelaide/25S1_WDC_UG_Groups_85
   cd 25S1_WDC_UG_Groups_85
   ```

### Unix (with `make`)

1. Initialize the SQL:
   ```bash
      make
   ```
2. Start the database:
   ```bash
      make start
   ```

3. Import the SQL schema into the `bookstore` database inside the SQL terminal:
   ```bash
      CREATE DATABASE bookstore;
      USE bookstore;
      SOURCE bookstore.sql;
   ```
4. Start the web
   ```bash
      npm install && npm start
   ``` 

### Unix (without `make`)

1. Start the MySQL service:
   ```bash
       sudo service mysql start && sudo mysql -u root -p
   ```
2. Import the SQL schema into the `bookstore` database inside the SQL terminal:
   ```bash
      CREATE DATABASE bookstore;
      USE bookstore;
      SOURCE bookstore.sql;
   ```
3. (Optional) Log in to MySQL to verify or adjust settings:
   ```bash
      sudo mysql -u root -p
   ```
4. Start the web
   ```bash
      npm install && npm start
   ``` 
### Windows

1. Open PowerShell or Command Prompt as Administrator.
2. Connect with the ```db.js```:
   ```powershell
      node db.js
   ```
3. Start the SQL terminal:
   ```powershell
      service mysql start && mysql -u root -p
   ```
4. Import the database
   ```powershell
      CREATE DATABASE bookstore;
      USE bookstore;
      SOURCE bookstore.sql;
   ```
5. Start the web
   ```bash
      npm install && npm start
   ``` 


### Database Connection Troubleshooting

If the app cannot connect to the database, follow these steps:

1. **Update authentication method**
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
   FLUSH PRIVILEGES;
   EXIT;
   ```
2. **Test connection from Node.js**
   ```bash
   node -e "require('dotenv').config(); \
   const mysql = require('mysql2/promise'); \
   mysql.createConnection({ \
     host: process.env.DB_HOST, \
     user: process.env.DB_USER, \
     password: process.env.DB_PASSWORD, \
     database: process.env.DB_NAME \
   }) \
   .then(() => console.log('CONNECTED')) \
   .catch(err => console.error('ERROR:', err.message));"
   ```

---

## Features

- **Book Search with Autocompletion**: Type-ahead suggestions from the local database.
- **Sale Records**: Track each user’s or seller’s sales history.
- **Reviews & Ratings**: Users can review sellers and rate their experience.
- **Admin Dashboard**: Administrators can manage users and content.
- **Wishlist Integration**: Add books from the Google Books API to a personal wishlist and view detailed book data.

---

## Known Bugs & Limitations

- **Intermittent Database Crashes**: The app sometimes loses connection to MySQL and requires a restart.
- **FakeShop API Limits**: Only 40 results per query; incomplete metadata may reduce displayed items.
- **Responsive Design Edge Cases**: On very small or unusual screen dimensions, some UI elements may overlap.
- **Admin User Creation**: Adding a user with a duplicate username or email via the admin page may crash the app.
- **Duplicate Book Titles**: Books with the same title but different authors are all shown together.
- **Password reset**: Password reset functionality is not yet implemented.
---
