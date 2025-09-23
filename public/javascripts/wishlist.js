const vueinst = Vue.createApp({
    data() {
        return {
        }
    },
    methods: {
        async fetch_apiProducts() {
            fetch('/search')
                .then(res => res.json)
                .then(data => {

                })
        }
    }
});

vueinst.mount('#app');