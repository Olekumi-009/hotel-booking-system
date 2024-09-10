const firebaseConfig = {
    apiKey: "AIzaSyD8EnLH8-l13pSlh1aaic_ZIQZfEsDpdHw",
    authDomain: "hostelbooking-73f97.firebaseapp.com",
    projectId: "hostelbooking-73f97",
    storageBucket: "hostelbooking-73f97.appspot.com",
    messagingSenderId: "736874264712",
    appId: "1:736874264712:web:70228c3ad23888da1e473d",
    measurementId: "G-2VRY17QRRN"
};

// initialize firebase
firebase.initializeApp(firebaseConfig)

const form = document.getElementById('form')
const account = localStorage.getItem("account")

form.addEventListener('submit', e => {
    e.preventDefault()
    let email = e.target[0].value
    let password = e.target[1].value
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
        account.toLowerCase().includes("admin") ? 
        window.location.href = "./admin.html" :
        window.location.href = "./hostels.html"
    })
    .catch((error) => {
        var errorCode = error.code;
        alert(errorCode)
    });
})