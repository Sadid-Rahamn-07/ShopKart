function toggleMenu() {
    var navbar = document.querySelector(".navbar");
    var left = document.querySelector(".nav_left");
    var center = document.querySelector(".nav_center");
    var right = document.querySelector(".nav_right");
    var menu_btn = document.querySelector(".menu-icon");

    if (navbar.classList.contains("open")) {
        // Collapse
        navbar.classList.remove("open");
        menu_btn.innerHTML = "&#9776;";
        menu_btn.style.fontSize = "20px";
    } else {
        // Expand
        navbar.classList.add("open");
        menu_btn.innerHTML = "&uarr;";
        menu_btn.style.fontSize = "25px";
    }
}

// Listen for window resize
window.addEventListener("resize", () => {
    if (window.innerWidth > 715) {
        var navbar = document.querySelector(".navbar");
        var menu_btn = document.querySelector(".menu-icon");

        // Remove mobile menu styles
        navbar.classList.remove("open");
        menu_btn.innerHTML = "&#9776;";
        menu_btn.style.fontSize = "20px";
    }
});
