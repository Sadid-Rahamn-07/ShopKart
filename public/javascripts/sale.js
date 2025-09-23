const vueinst = Vue.createApp({
    data() {
        return {
            product: {
                title: 'Title',
                category: 'Category',
                price: 'Price',
                img: null,
                description: 'Describe the the product',
            },
            profileImage: null,
            profileImageFile: null,
            activeSection: 'MySale',
            tab: 'post',
            searchQuery: '',
            products: [],         // all products fetched
            filteredProducts: [],  // products displayed
        }
    },
    methods: {
        async uploadProduct() {
            const form_productData = new FormData();
            for (let key in this.product) {
                form_productData.append(key, this.product[key])
            }
            if (this.profileImageFile) {
                form_productData.append('img', this.profileImageFile)
            };
            fetch('users/postProduct', {
                method: 'POST',
                body: form_productData,
                credentials: 'include',
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        alert('Product updated successfully!');
                        this.product = {
                            title: '',
                            category: '',
                            price: '',
                            img: '',
                            description: '',
                        };
                        this.profileImage = null;
                        this.profileImageFile = null;

                        // optional: clear <input type="file">
                        const fileInput = document.querySelector('input[type="file"]');
                        if (fileInput) fileInput.value = '';
                    } else {
                        alert("Product not uploaded");
                    }
                })
                .catch(err => console.error(err));
        },
        async changeTab(tabName) {
            this.tab = tabName;
            this.showUserProducts();
        },
        async showUserProducts() {
            fetch('/users/getUserProducts', {
                credentials: 'include'
            })
                .then(res => res.json())
                .then(data => {
                    this.products = data;          // store all products
                    this.filteredProducts = data;  // initially show all
                })
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
        async handleImageUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            this.profileImageFile = file;            // store the File object
            this.profileImage = URL.createObjectURL(file); // preview
        },
    }
});

vueinst.mount('#app');