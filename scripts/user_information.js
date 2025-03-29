function saveUserInfo() {
    // Get user input values from the form
    let firstName = document.getElementById("grid-first-name").value;
    let lastName = document.getElementById("grid-last-name").value;
    let email = document.getElementById("grid-email").value;
    let vehicleType = document.getElementById("grid-vehicle_type").value;
    let licensePlate = document.getElementById("grid-license_plate").value;
    let city = document.getElementById("grid-city").value;
    let province = document.getElementById("grid-province").value;
    
    // Get currently logged-in user
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            let userID = user.uid; // Unique ID for the user
            
            // Store the data in Firestore under "users" collection
            db.collection("users").doc(userID).set({
                firstName: firstName,
                lastName: lastName,
                email: email,
                vehicleType: vehicleType,
                licensePlate: licensePlate,
                city: city,
                province: province,
                userID: userID
            })
            .then(() => {
                alert("User information saved successfully!");
            })
            .catch(error => {
                console.error("Error saving document: ", error);
            });
        } else {
            alert("You need to be logged in to save your information.");
        }
    });
}