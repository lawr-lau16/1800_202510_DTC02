document.addEventListener("DOMContentLoaded", loadParkingSpots);


function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            console.log(user.uid); //print the uid in the browser console
            console.log(user.displayName);  //print the user name in the browser console
            userName = user.displayName;

            //method#1:insert with JS
            document.getElementById("name-goes-here").innerText = userName;    

            //method #2:  insert using jquery
            //$("#name-goes-here").text(userName); //using jquery

            //method #3:  insert using querySelector
            //document.querySelector("#name-goes-here").innerText = userName

        } else {
            // No user is signed in.
            console.log ("No user is logged in");
        }
    });
}
getNameFromAuth(); //run the function


// Check if user is logged in. Saves the parkingSpotID under the user's favorite collection.
function saveToFavorites(parkingSpotID) {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            let userID = user.uid; // Get the logged-in user's ID
            
            db.collection("users").doc(userID).collection("favorites").doc(parkingSpotID).set({
                parkingSpotID: parkingSpotID,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                console.log("Parking spot added to favorites!");
                alert("Saved to favorites!");
            })
            .catch(error => {
                console.error("Error adding to favorites: ", error);
            });
        } else {
            alert("You need to be logged in to save favorites.");
        }
    });
}


// Take the selectedSpotID (when clicking a pin)
// Calls saveToFavorites(parkingSpotID) to store it
function addFavorite() {
    console.log("🔍 Attempting to save favorite. Selected Spot ID:", selectedSpotID);

    if (!selectedSpotID) {
        alert("Select a parking spot first!");
        return;
    }
    
    saveToFavorites(selectedSpotID);
}


// Checks for changes in user's favorite collection
// Updates favorites list if there are changes
function loadFavorites() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            let userID = user.uid;
            db.collection("users").doc(userID).collection("favorites").onSnapshot(snapshot => {
                let favoriteList = document.getElementById("favoriteList");
                favoriteList.innerHTML = ""; // Clear list

                snapshot.forEach(doc => {
                    let favSpot = doc.data();
                    
                    // Fetch the parking spot details using its ID
                    db.collection("parking_spots").doc(favSpot.parkingSpotID).get().then(spotDoc => {
                        if (spotDoc.exists) {
                            let spotData = spotDoc.data();
                            let listItem = document.createElement("li");
                            // Edit here to change how favorites show up
                            listItem.innerText = `Favorite: ${spotData.name}`;
                            favoriteList.appendChild(listItem);
                        }
                    });
                });
            });
        }
    });
}


// Call function on page load
loadFavorites();
