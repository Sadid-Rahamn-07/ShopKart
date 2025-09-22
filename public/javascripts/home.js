const vueinst = Vue.createApp({
    data() {
        return {
            username: null,   // must return an object
            linkUrl: '/user.html',
            image_path: '/uploads/default.png' // initial fallback
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
        }

    },
    mounted() {
        this.fetchUsername();
        this.fetchUserPic();
        setInterval(this.fetchUsername, 5000); // refresh the page every 5 seconds
    }
});

vueinst.mount('#app'); // make sure you mount it
