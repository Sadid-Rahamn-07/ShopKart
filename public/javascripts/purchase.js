const vueinst = Vue.createApp({
    data() {
        return {
            active: true,
            links: [
                { name: 'Account', label: 'Account', href: '/account.html' },
                { name: 'Purchase', label: 'Order', href: '/purchase.html' },
                { name: 'MySale', label: 'Sale', href: '###' },
                { name: 'Wishlist', label: 'Wishlist', href: '/wishlist.html' }
            ],
        }
    }
});

vueinst.mount('#app');