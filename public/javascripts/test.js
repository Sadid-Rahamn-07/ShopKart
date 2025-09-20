function get_data(query) {
    fetch(`./search?title=${encodeURIComponent(query)}`)
        .then((response) => response.json())
        .then((data) => {
            load(data);
        })
        .catch((err) => console.error('Error fetching books:', err));
}



