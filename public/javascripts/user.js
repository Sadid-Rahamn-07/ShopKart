function login(event) {
    event.preventDefault();
    const form = document.getElementById("login-form");
    const username = form.name.value.trim();
    const password = form.password.value;

    fetch('/users/login', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("User login successful!");
                form.reset();
                window.location.href = 'index.html';
            } else {
                alert("Error: " + data.error);
            }
        })
        .catch(err => {
            console.error(err);
            alert("Server error");
        });
}


function createUser(event) {
    event.preventDefault();
    const form = document.getElementById("signup-form");
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password != confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    //fetch(arg1,arg2)
    /* 
        arg1 = '/users/signup' → this is the endpoint (your Express route).
        It tells fetch where to send the request.

        arg2 = It’s the options object that configures the request.
        Inside it:
            method: "POST" → tells fetch to send a POST request.
            headers: { "Content-Type": "application/json" } → tells the server we’re sending JSON.
            body: JSON.stringify({ name, email, password }) → the actual data we want to send.
            If you only want to GET something, you can omit this object:
    */
    fetch('/users/signup', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    })
        //converting the data (response Object) received from fetch() and converting it to json
        .then(res => res.json())
        //checking if there was no error
        .then(data => {
            if (data.success) {
                alert("User created successfully!");
                form.reset();
                window.location.href = 'index.html';
            } else {
                alert("Error: " + data.error);
            }
        })
        .catch(err => {
            console.error(err);
            alert("Server error");
        });
}

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const formTitle = document.getElementById("form-title");

document.getElementById("show-signup").addEventListener("click", () => {
    loginForm.classList.remove("active");
    signupForm.classList.add("active");
    formTitle.textContent = "Sign Up";
});

document.getElementById("show-login").addEventListener("click", () => {
    signupForm.classList.remove("active");
    loginForm.classList.add("active");
    formTitle.textContent = "Login";
});
