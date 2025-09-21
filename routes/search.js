var express = require('express');
var router = express.Router();

router.get("/", (req, res) => {
    const name = req.query.title;
    const api = `https://api.escuelajs.co/api/v1/products/?title=${encodeURIComponent(name)}`;

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


module.exports = router;
