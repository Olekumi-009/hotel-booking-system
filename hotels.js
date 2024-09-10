let hamburger = document.querySelector(".hamburger")
let navList = document.querySelector("ul")

hamburger.addEventListener('click', () => {
    navList.classList.toggle("active")
})