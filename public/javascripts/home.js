const vueinst = Vue.createApp({
    data() {
        return {
            username: null   // must return an object
        };
    },
    methods: {            // should be "methods", not "method"
        async fetchUsername() {
            fetch('/get_username', {
                credentials: 'include' // send cookies for session
            })
                .then(res => res.json())
                .then(data => {
                    this.username = data.username; // update reactive property
                })
                .catch(err => console.error(err));
        }
    },
    mounted() {
        this.fetchUsername();
        setInterval(this.fetchUsername, 5000); // refresh the page every 5 seconds
    }
});

vueinst.mount('#app'); // make sure you mount it
