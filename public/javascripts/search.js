// Function to fetch data from backend
function get_data(query) {
    fetch(`/search/?title=${query}`)
        .then(res => {
            console.log('Status:', res.status);
            return res.text(); // temporarily get raw text
        })
        .then(text => {
            console.log('Raw response:', text);
            try {
                const data = JSON.parse(text);
                load(data);
            } catch (err) {
                console.error('Failed to parse JSON:', err, 'Text:', text);
            }
        })
        .catch(err => console.error('Error fetching data:', err));
}

// Function to render data
function load(data) {
    const displayer = document.querySelector(".display-container");
    displayer.innerHTML = ""; // clear previous content

    if (!data || data.length === 0) {
        displayer.textContent = "No results found.";
        return;
    }
    data.forEach(item => {
        const div = document.createElement("div");
        div.className = "card";

        //title
        const h1 = document.createElement("h3");
        h1.className = "title"
        h1.textContent = item.title;
        div.appendChild(h1);

        const img = document.createElement("img");
        img.className = "img_product";
        img.src = item.images[0];
        div.appendChild(img);

        //price
        const price = document.createElement("p");
        price.className = "price";
        price.textContent = "$" + item.price;
        div.appendChild(price);

        //description
        const description = document.createElement("p");
        description.className = "description";
        description.textContent = item.description;
        div.appendChild(description);

        //append it the displayer
        displayer.appendChild(div);
    });
}
