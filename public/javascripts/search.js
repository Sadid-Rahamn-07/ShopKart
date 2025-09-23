const vueinst = Vue.createApp({
    data() {
        return {
            searchQuery: '',
            products: [],
            loading: true
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
        }
    },
    mounted() {
        // Load all products initially
        this.get_data('');
    }
});

vueinst.mount('#app');

