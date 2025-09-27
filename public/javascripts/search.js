const vueinst = Vue.createApp({
    data() {
        return {
            searchQuery: '',
            products: [],
            loading: true,
            addtocartProduct: [],
            username: '',
            category: ''
        }
    },
    methods: {
        async get_data(query = '') {
            try {
                // If query is empty, backend can return all products
                const res = await fetch(`/search/?title=${query}`);
                const data = await res.json();
                this.products = data;
            } catch (err) {
                console.error("Error fetching products:", err);
                this.products = [];
            } finally {
                this.loading = false; // hide loader when finished
            }
        },
        async getProductID(id) {
            try {
                const res = await fetch(`/search/getProduct/?id=${id}`);
                const data = await res.json();
                const product = data.product || data;

                // Prevent duplicates
                const exists = this.addtocartProduct.some(item => item.id === product.id);
                if (exists) {
                    alert('Product is already in the cart!');
                    return;
                }

                this.addtocartProduct.push(product);

                // Save to per-user localStorage
                localStorage.setItem(
                    `productApi_${this.username || 'guest'}`,
                    JSON.stringify(this.addtocartProduct)
                );

                alert('Product added to cart!');
            } catch (err) {
                console.error("Error fetching product:", err);
                alert('Failed to add product to cart.');
            }
        },
        async fetchUsername() {
            try {
                const res = await fetch('/users/get_username', { credentials: 'include' });
                const data = await res.json();
                this.username = data.username || 'guest';

                // Load user's cart from localStorage
                this.addtocartProduct = JSON.parse(
                    localStorage.getItem(`productApi_${this.username}`) || '[]'
                );
            } catch (err) {
                console.error(err);
            }
        },
        async filter() {
            try {
                if (this.category !== "0") {
                    // Fetch filtered by category
                    const res = await fetch(`/search/filter/?category=${this.category}`);
                    this.products = await res.json();
                } else {
                    // Show all (call existing get_data)
                    this.get_data(this.searchQuery);
                }
            } catch (err) {
                console.error("Error filtering:", err);
                this.products = [];
            }
        }

    },
    watch: {
        category() {
            this.filter();
        }
    },
    async mounted() {
        await this.fetchUsername();
        // Load all products initially
        this.get_data('');

    }
});

vueinst.mount('#app');

