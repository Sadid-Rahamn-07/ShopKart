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