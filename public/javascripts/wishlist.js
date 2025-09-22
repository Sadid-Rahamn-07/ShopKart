const vueinst = Vue.createApp({
    data() {
        return {
            links: [
                { name: 'Account', label: 'Account', href: '/account.html' },
                { name: 'Purchase', label: 'Order', href: '/purchase.html' },
                { name: 'MySale', label: 'Sale', href: '/sale.html' },
            ],
        }
    }
});

vueinst.mount('#app');