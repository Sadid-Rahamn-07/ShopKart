USE ShopKart;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    address VARCHAR(255),
    phone VARCHAR(15),
    gender ENUM('male', 'female', 'prefer_not_to_say') DEFAULT 'male',
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    dob DATE,                     -- Date of Birth
    profile_image VARCHAR(255),   -- Path or filename of profile image
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
