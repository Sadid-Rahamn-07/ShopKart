function toggleMenu() {
    var navbar = document.querySelector(".navbar");
    var menu_btn = document.querySelector(".menu-icon");
    const search_form = document.getElementById("search-form-mobile");

    if (navbar.classList.contains("open")) {
        // Collapse
        navbar.classList.remove("open");
        menu_btn.innerHTML = "&#9776;";
        menu_btn.style.fontSize = "20px";
        menu_btn.style.textAlign = "left";
        menu_btn.style.width = "auto";
        search_form.style.display = "none";

    } else {
        // Expand
        navbar.classList.add("open");
        menu_btn.innerHTML = "&uarr;";
        menu_btn.style.fontSize = "25px";
        menu_btn.style.cursor = "pointer";
        menu_btn.style.width = "100%";
        menu_btn.style.textAlign = "center";
        search_form.style.display = "none";

    }
}

// Listen for window resize
window.addEventListener("resize", () => {
    if (window.innerWidth > 715) {
        var navbar = document.querySelector(".navbar");
        var menu_btn = document.querySelector(".menu-icon");
        const search_form = document.getElementById("search-form-mobile");

        // Remove mobile menu styles
        navbar.classList.remove("open");
        menu_btn.innerHTML = "&#9776;";
        menu_btn.style.fontSize = "20px";
        menu_btn.style.textAlign = "left";
        menu_btn.style.width = "auto";
        search_form.style.display = "none";
    }
});

