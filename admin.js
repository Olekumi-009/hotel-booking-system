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
const db = firebase.firestore();

const roomNumber = document.getElementById("checkRoomAvail")
const checkBtn = document.getElementById("checkRoomAvailBtn")
const msg = document.getElementById("checkRoomAvailStatus")
const addOccupantName = document.getElementById("addOccupantName")
const addOccupantRoomNo = document.getElementById("addOccupantRoomNo")
const addOccupantBtn = document.getElementById("addOccupantBtn")
const addOccupantStatus = document.getElementById("addOccupantStatus")
const addOccupantForm = document.querySelector(".addOccupantForm")
const recordList = document.querySelector("#recordList")
const clearAllBtn = document.getElementById("clearAllBtn")
const clearRoomNo = document.getElementById("clearRoomNo")
const clearRoomBtn = document.getElementById("clearRoomBtn")
const clearRoomStatus = document.getElementById("clearRoomStatus")


let bookedRooms = db.collection("bookings").doc("bookedRooms");
let occupants = db.collection("bookings").doc("occupants");
let roomNumbers = []
let customers = []

// create record list function
const createList = (arr) => {
const record = document.createElement("p")
record.classList.add("recordList")
record.textContent = `Name: ${arr.name} (Room : ${arr.roomNumber})`
recordList.appendChild(record)
}


addOccupantForm.style.display = "none"

//fetch data for occupants booked
occupants.get().then(doc => {
if(doc.exists){
    recordList.replaceChildren()
    customers = doc.data().occupants
    customers.forEach(customer => {
        createList(customer)
    })
}
})

bookedRooms.get().then((doc) => {
if (doc.exists) {
    roomNumbers = doc.data().roomNumbers
}
})

//check button add event listner
checkBtn.addEventListener("click", ()=>{
let booked = false;
msg.textContent = "Checking...";
(roomNumber.value < 1 || roomNumber.value > 40) ?
msg.textContent = "Please enter a room between 1 and 40" :
bookedRooms.get().then((doc) => {
    if (doc.exists) {
        roomNumbers = doc.data().roomNumbers
        doc.data().roomNumbers.forEach(room => {
            if(roomNumber.value == room){
            booked = true;
            addOccupantForm.style.display = "none"
            msg.textContent = `Sorry rooom ${roomNumber.value} has been booked`
            return
            }
        })
        if(!booked){
            msg.textContent = `Room ${roomNumber.value} is available`
            addOccupantForm.style.display = "block"
        }
    } else {
        // Add a new document in collection
        db.collection("bookings").doc("bookedRooms").set({
            roomNumbers: [roomNumber.value]
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    }
}).catch((error) => {
        console.log("Error getting document:", error);
});

})

addOccupantForm.addEventListener('submit', e=>{
    e.preventDefault()
    let isBooked = false
    roomNumbers.forEach(room => {
        if(addOccupantRoomNo.value == room){
            isBooked = true;
            addOccupantStatus.textContent = `Sorry rooom ${addOccupantRoomNo.value} has been booked`
            return
        }
    })
    if(!isBooked){
        addOccupantStatus.textContent = "Adding occupant..."
        roomNumbers.push(addOccupantRoomNo.value)
        occupants.get().then((doc) => {
            if (doc.exists) {
                customers = doc.data().occupants
                customers.push({name: addOccupantName.value, roomNumber: addOccupantRoomNo.value})
                occupants.update({
                occupants: customers
                })
                .then(()=>{
                bookedRooms.update({
                    roomNumbers
                })
                .catch((error) => {
                        console.error("Error updating document: ", error);
                });
                })
                .catch((error) => {
                    console.error("Error updating document: ", error);
                });
            } else {
                db.collection("bookings").doc("occupants").set({
                occupants: [{name: addOccupantName.value, roomNumber: addOccupantRoomNo.value}]
                })
                .catch((error) => {
                console.error("Error writing document: ", error);
                });
            }
        })
        .then(()=>{
            addOccupantStatus.textContent = "Occupant added"
        })
        .then(() => {
            recordList.replaceChildren()
            customers.forEach(customer => {
                createList(customer)
            })
        })
        .catch((error) => {
                console.log("Error getting document:", error);
        });
    }
})

// search occupant
const searchOccupant = document.getElementById("searchOccupant")
const searchOccupantBtn = document.getElementById("searchOccupantBtn")
const searchOccupantStatus = document.getElementById("searchOccupantStatus")

searchOccupantBtn.addEventListener('click', () =>{
searchOccupantStatus.textContent = "Searching..."
let found = false
customers.forEach(customer => {
    if (searchOccupant.value == customer.roomNumber || searchOccupant.value == customer.name ){
        searchOccupantStatus.textContent = customer.name
        found = true;
        return
    }
})
if(!found){
    searchOccupantStatus.textContent = "No occupant found"
}
})

// clear room button
clearRoomBtn.addEventListener("click", ()=>{   
roomNumbers.forEach(room =>{
    if(room == clearRoomNo.value){
        roomNumbers.splice(roomNumbers.indexOf(room), 1)
        return
    }
})

customers.forEach(customer =>{
    if(customer.roomNumber == clearRoomNo.value){
        customers.splice(customers.indexOf(customer), 1)
        return
    }
})

clearRoomStatus.textContent = `Clearing room ${clearRoomNo.value}...`

occupants.update({
    occupants: customers
})
.then(()=>{
    bookedRooms.update({
        roomNumbers
    })
    .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
    });
})
.then(() => {
    clearRoomStatus.textContent = `Room ${clearRoomNo.value} cleared`
    recordList.replaceChildren()
    customers.forEach(customer => {
        createList(customer)
    })
})
.catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
})


// clear all button
clearAllBtn.addEventListener("click", () => {
let confirm = window.confirm("are you sure you want to delete all reservations?")
if(confirm)
{
    customers = []
    roomNumbers = []
    recordList.replaceChildren()
    occupants.update({
        occupants: customers
    })
    .then(()=>{
        bookedRooms.update({
            roomNumbers
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    })
    .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
    });
}
})