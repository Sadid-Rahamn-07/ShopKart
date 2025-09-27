const vueinst = Vue.createApp({
    data() {
        return {
            activeSection: 'Account', // stores which section is active
            username: null,
            tab: 'post',
            links: [
                { name: 'Account', label: 'Account', href: '/account.html' },
                { name: 'Purchase', label: 'Order', href: '/purchase.html' },
                { name: 'MySale', label: 'Sale', href: '/sale.html' },
                { name: 'Wishlist', label: 'Wishlist', href: '/wishlist.html' }
            ],
            form: {
                username: '',
                address: '',
                email: '',
                phone: '',
                gender: 'male',
                year: '',
                month: '',
                day: ''
            },
            profileImage: null,
            profileImageFile: null,    // actual File object to send in FormData
            years: Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i),
            months: [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ]

        }
    },
    computed: {
        daysInMonth() {
            if (!this.form.year || !this.form.month) return Array.from({ length: 31 }, (_, i) => i + 1);
            return Array.from(
                { length: new Date(this.form.year, this.form.month, 0).getDate() },
                (_, i) => i + 1
            );
        }
    },
    methods: {
        async showSection(section) {
            // toggle the same section, otherwise switch
            this.activeSection = section
        },
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
        async handleImageUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            this.profileImageFile = file;            // store the File object
            this.profileImage = URL.createObjectURL(file); // preview
        },
        async submitForm() {
            const formData = new FormData();
            for (let key in this.form) formData.append(key, this.form[key]);
            if (this.profileImageFile) formData.append('profile_photo', this.profileImageFile);

            fetch('/users/update', {
                method: 'PUT',
                body: formData,
                credentials: 'include'
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        alert('Profile updated successfully!');
                        this.form = {
                            username: '',
                            address: '',
                            email: '',
                            phone: '',
                            gender: 'male',
                            year: '',
                            month: '',
                            day: ''
                        };
                        this.profileImage = null;
                        this.profileImageFile = null;

                        // optional: clear <input type="file">
                        const fileInput = document.querySelector('input[type="file"]');
                        if (fileInput) fileInput.value = '';
                    } else {
                        alert('Failed to update profile.');
                    }
                })
                .catch(err => console.error(err));
        },
        async logout() {
            fetch('/users/logout', {
                method: 'POST',
                credentials: 'include' // send cookies
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        alert('Logged out!');
                        window.location.href = '/index.html'; // redirect to login page
                    } else {
                        alert('Logout failed.');
                    }
                })
                .catch(err => console.error(err));
        },
    },
    mounted() {
        this.fetchUsername();
        setInterval(this.fetchUsername, 5000); // refresh the page every 5 seconds
    }
});

vueinst.mount('#app');