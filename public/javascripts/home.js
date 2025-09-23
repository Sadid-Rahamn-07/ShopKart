const vueinst = Vue.createApp({
    data() {
        return {
            username: null,   // must return an object
            linkUrl: '/user.html',
            image_path: '/images/sample.png', // initial fallback
            new_link: '#'
        };
    },
    methods: {            // should be "methods", not "method"
        async fetchUsername() {
            fetch('/users/get_username', {
                credentials: 'include' // send cookies for session
            })
                .then(res => res.json())
                .then(data => {
                    this.username = data.username; // update reactive property
                    if (this.username) {
                        this.linkUrl = '/account.html';
                    } else {
                        this.linkUrl = '/user.html';
                    }
                })
                .catch(err => console.error(err));
        },
        async fetchUserPic() {
            fetch('/users/get_userPic', {
                credentials: 'include'
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        this.image_path = data.profile_image; // directly access profile_image
                    } else {
                        this.image_path = '/uploads/default.png'; // fallback avatar
                    }
                })
                .catch(err => {
                    console.error(err);
                    this.image_path = '/uploads/default.png'; // fallback on error
                });
        },
        async load(data) {
            const displayer = document.querySelector(".display-container");
            displayer.innerHTML = ""; // clear previous content

            if (!data || data.length === 0) {
                displayer.textContent = "No results found.";
                return;
            }
            data.forEach(item => {
                console.log("Image filename:", item.product_image); // 👈 add this
                const div = document.createElement("div");
                div.className = "card";

                //title
                const h1 = document.createElement("h3");
                h1.className = "title"
                h1.textContent = item.title;
                div.appendChild(h1);

                const img = document.createElement("img");
                img.className = "img_product";
                img.src = "/uploads/products/" + item.product_image;
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

                //add to card button
                const button = document.createElement('button');
                button.className = 'btn';
                button.textContent = 'Add to Cart';
                button.onclick = async () => {
                    try {
                        const response = await fetch('/purchase/order', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ productId: item.id })
                        });

                        const data = await response.json();

                        if (data.success) {
                            alert('Product added to cart!');
                        } else {
                            alert(data.message || 'Failed to add product to cart.');
                        }
                    } catch (err) {
                        console.error('Error:', err);
                        alert('An error occurred while adding the product.');
                    }
                };
                div.appendChild(button)
                //append it the displayer
                displayer.appendChild(div);
            });
        },
        async fetchUserProduct() {
            fetch('/users/get_products')
                .then(res => res.json())
                .then(data => {
                    this.load(data); // data is an array of all products
                })
                .catch(err => console.error('Error fetching products:', err));
        },
        async fetchUrl(url) {
            try {
                // Call server to check if user is logged in
                const res = await fetch('/users/get_username', { credentials: 'include' });
                const data = await res.json();

                if (data.success) {
                    // User is logged in, navigate
                    const target = url.startsWith('/') ? url : '/' + url;
                    window.location.href = target;
                } else {
                    alert('Please log in first!');
                }
            } catch (err) {
                console.error(err);
                alert('Error checking login status.');
            }
        },
    },
    mounted() {
        this.fetchUsername();
        this.fetchUserPic();
        this.fetchUserProduct();
        setInterval(this.fetchUsername, 5000); // refresh the page every 5 seconds
    }
});

vueinst.mount('#app'); // make sure you mount it
