let admin = document.getElementById('admin')
let student = document.getElementById('student')

admin.addEventListener("click", e => {
    localStorage.setItem('account', admin.textContent)
})

student.addEventListener("click", e => {
    localStorage.setItem('account', student.textContent)
})