document.addEventListener("DOMContentLoaded", function() {
    let menuIcon = document.querySelector(".header__burger");
    let menuClose = document.querySelector(".menu__close");
    let menu = document.querySelector(".menu");
    let searchButton = document.querySelector(".icon-search");
    let searchInput = document.querySelector("input.search");
    let searchLogo = searchButton.querySelector(".icon__placeholder");
    
    menuIcon.addEventListener("click", function(ev){
        menu.classList.add("menu-open");
    });
    
    menuClose.addEventListener("click", function(ev){
        menu.classList.remove("menu-open");
    });
    
    searchButton.addEventListener("click", function(ev){
        searchLogo.classList.toggle("icon__placeholder-search");
        searchInput.classList.toggle("search-visable");    
    });
    
});