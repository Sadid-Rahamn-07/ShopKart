var express = require('express');
var router = express.Router();

router.get("/", (req, res) => {
    const name = req.query.title;
    const api = `https://api.escuelajs.co/api/v1/products/?title=${encodeURIComponent(name)}&offset=0&limit=10`;

    fetch(api)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error Status: ${response.status}`);
            }
            return response.json(); // parse the fetch response into js array
        })
        .then(data => {
            console.log('get the data:', data);
            res.json(data); // send data to client
        })
        .catch(error => {
            console.error('Error during GET request:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

router.get('/getProduct', (req, res) => {
    const id = req.query.id;
    const api = `https://api.escuelajs.co/api/v1/products/${id}`;
    fetch(api)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error Status: ${response.status}`);
            }
            return response.json(); // parse the fetch response into js array
        })
        .then(data => {
            console.log('get the data:', data);
            res.json(data); // send data to client
        })
        .catch(error => {
            console.error('Error during GET request:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

router.get('/filter', (req, res) => {
    const id = req.query.category;
    const name = req.query.title;

    let api;

    if (id === "0") {
        // Show all with optional title filter
        api = `https://api.escuelajs.co/api/v1/products/?title=${encodeURIComponent(name || '')}&offset=0&limit=10`;
    } else {
        // Filter by category id
        api = `https://api.escuelajs.co/api/v1/categories/${id}/products`;
    }

    fetch(api)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('get the data:', data);
            res.json(data);
        })
        .catch(error => {
            console.error('Error during GET request:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});



module.exports = router;
