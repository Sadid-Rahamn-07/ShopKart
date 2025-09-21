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

function createUser() {

    const form = document.getElementById("signup-form");
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value
    const confirmPassword = form.confirmPassword.value;
    if (password != confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    fetch(`/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("User created successfully!");
                form.reset();
            }
            else {
                alert("Error: " + data.error);
            }
        })
        .catch(err => {
            console.error(err);
            alert("server error");
        });
}