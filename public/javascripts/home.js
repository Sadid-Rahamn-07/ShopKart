const vueinst = Vue.createApp({
    data() {
        return {
            username: null,   // must return an object
            linkUrl: '/user.html',
            image_path: '/images/sample.png', // initial fallback
            new_link: '#',
            products: [],
            filteredProducts: [],
            searchQuery: ''
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
        async addToCart(productID) {
            try {
                const response = await fetch('/purchase/order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId: productID })
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
        },
        async fetchUserProduct() {
            fetch('/users/get_products')
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        this.products = data.products;
                        this.filteredProducts = data.products; // optional
                    }
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
        async searchProducts() {
            const query = this.searchQuery.trim().toLowerCase();
            if (!query) {
                this.filteredProducts = this.products;
                return;
            }

            this.filteredProducts = this.products.filter(product =>
                product.title.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query)
            );
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
