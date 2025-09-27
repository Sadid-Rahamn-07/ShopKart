const vueinst = Vue.createApp({
    data() {
        return {
            orders: [],
            tab: 'orders',
            reviews_items: [],
            reviews: {}, // store per-order reviews
            username: '',
            addtocartProductApi: [],
        };
    },
    methods: {
        async fetchOrders() {
            try {
                const res = await fetch('/purchase/getOrdersInfo', { credentials: 'include' });
                const data = await res.json();

                if (data.success) {
                    this.orders = data.orders;
                } else {
                    alert(data.message || "Failed to fetch orders");
                }
            } catch (err) {
                console.error("Error fetching orders:", err);
            }
        },
        async fetchPendingReviews() {
            const res = await fetch('/purchase/getPendingReviews');
            const data = await res.json();

            if (data.success) {
                this.reviews_items = data.review_items;

                // Initialize review state for each review
                this.reviews_items.forEach(item => {
                    if (!this.reviews[item.id]) {
                        this.reviews[item.id] = {
                            rating: null,
                            comments: ''
                        };
                    }
                });
            } else {
                alert(data.message || "Failed to fetch reviews");
            }
        },
        async cancelOrder(orderID) {
            const res = await fetch('/purchase/cancelOrder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderID })
            });
            const data = await res.json();
            if (data.success) {
                alert('Order canceled!');
                this.fetchOrders(); // refresh the list
            } else {
                alert('Failed to cancel order.');
            }
        },
        async changeTab(tabName) {
            this.tab = tabName;
        },
        async submitReview(reviewId) {
            const review = this.reviews[reviewId];
            try {
                const res = await fetch('/purchase/review', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        reviews_id: reviewId,
                        rating: review.rating,
                        comments: review.comments,
                        credentials: 'include'
                    })
                });
                const data = await res.json();
                if (data.success) {
                    tab = 'reviews';
                    this.fetchPendingReviews();
                    alert('Review submitted!')
                }
                else {
                    alert('Failed to submit review.')
                };
            } catch (err) {
                console.error(err);
                alert('Error submitting review.');
            }
        },
        async placeOrder(orderID) {
            const res = await fetch('/purchase/placeOrder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderID })
            });
            const data = await res.json();
            if (data.success) {
                alert('Order Confirmed!');
                this.fetchOrders(); // refresh the list
                this.fetchPendingReviews();
            } else {
                alert('Failed to confirm order.');
            }
        },
        async placeOrderApi(ApiorderID) {
            try {
                const api = `https://api.escuelajs.co/api/v1/products/${ApiorderID}`;

                const res = await fetch(api, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                const data = await res.json();

                // data is the deleted product object, not {success: true}
                console.log('Deleted product:', data);
                alert('Order confirmed');

                // Optional: remove it from local Vue array to update UI
                this.addtocartProductApi = this.addtocartProductApi.filter(item => item.id !== ApiorderID);
                localStorage.setItem(`productApi_${this.username}`, JSON.stringify(this.addtocartProductApi));

            } catch (err) {
                console.error('Failed to confirm order:', err);
                alert('Failed to confirm order.');
            }
        },
        async removeFromCart(productId) {
            // Filter out the product with the matching ID
            this.addtocartProductApi = this.addtocartProductApi.filter(
                item => item.id !== productId
            );

            // Update localStorage
            localStorage.setItem(
                `productApi_${this.username}`,
                JSON.stringify(this.addtocartProductApi)
            );

            alert('Product removed from cart!');
        },
        async fetchUsername() {
            try {
                const res = await fetch('/users/get_username', { credentials: 'include' });
                const data = await res.json();
                this.username = data.username || 'guest';

                // Load user's cart from localStorage after username is set
                this.addtocartProductApi = JSON.parse(
                    localStorage.getItem(`productApi_${this.username}`) || '[]'
                );
            } catch (err) {
                console.error(err);
            }
        },
    },
    async mounted() {
        await this.fetchUsername();
        this.fetchOrders();
        this.fetchPendingReviews();
    }
});

vueinst.mount('#app');
