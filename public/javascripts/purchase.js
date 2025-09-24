const vueinst = Vue.createApp({
    data() {
        return {
            orders: [],
            tab: 'orders',
            reviews_items: [],
            reviews: {} // store per-order reviews
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
            } else {
                alert('Failed to confirm order.');
            }
        }
    },
    mounted() {
        this.fetchOrders();
        this.fetchPendingReviews();
    }
});

vueinst.mount('#app');
