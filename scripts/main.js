function getNameFromAuth() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if a user is signed in:
    if (user) {
      // Do something for the currently logged-in user here:
      console.log(user.uid); // Print the uid in the browser console
      console.log(user.displayName); // Print the user name in the browser console
      const userName = user.displayName || user.email || "User"; // Fallback to email if displayName is not set

      // Update desktop placeholder
      const userNameElement = document.getElementById("name-goes-here");
      if (userNameElement) userNameElement.innerText = `${userName}!`;

      // Update mobile placeholder
      const userNameMobileElement = document.getElementById("name-goes-here-mobile");
      if (userNameMobileElement) userNameMobileElement.innerText = `${userName}!`;
    } else {
      // No user is signed in.
      console.log("No user is logged in");

      // Update desktop placeholder
      const userNameElement = document.getElementById("name-goes-here");
      if (userNameElement) userNameElement.innerText = "Welcome, Guest!";

      // Update mobile placeholder
      const userNameMobileElement = document.getElementById("name-goes-here-mobile");
      if (userNameMobileElement) userNameMobileElement.innerText = "Welcome, Guest!";
    }
  });
}

getNameFromAuth(); // Run the function

// Check if user is logged in. Saves the parkingSpotID under the user's favorite collection.
function saveToFavorites(parkingSpotID) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      let userID = user.uid; // Get the logged-in user's ID

      db.collection("users")
        .doc(userID)
        .collection("favorites")
        .doc(parkingSpotID)
        .set({
          parkingSpotID: parkingSpotID,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          console.log("Parking spot added to favorites!");
          alert("Saved to favorites!");
        })
        .catch((error) => {
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
  console.log(
    "🔍 Attempting to save favorite. Selected Spot ID:",
    selectedSpotID
  );

  if (!selectedSpotID) {
    alert("Select a parking spot first!");
    return;
  }

  saveToFavorites(selectedSpotID);
}

// Checks for changes in user's favorite collection
// Updates favorites list if there are changes
function loadFavorites() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      let userID = user.uid;
      db.collection("users")
        .doc(userID)
        .collection("favorites")
        .onSnapshot((snapshot) => {
          let favoriteList = document.getElementById("favoriteList");
          favoriteList.innerHTML = ""; // Clear list

          snapshot.forEach((doc) => {
            let favSpot = doc.data();

            // Fetch the parking spot details using its ID
            db.collection("parking_spots")
              .doc(favSpot.parkingSpotID)
              .get()
              .then((spotDoc) => {
                if (spotDoc.exists) {
                  let spotData = spotDoc.data();
                  let listItem = document.createElement("li");
                  // Edit here to change how favorites show up
                  listItem.innerText = `${spotData.name}`;
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

let selectedRating = 0;

// Function to handle star clicks
document.querySelectorAll(".star").forEach((star) => {
  star.addEventListener("click", function () {
    selectedRating = parseInt(this.getAttribute("data-value")); // Get star value
    updateStarColors();
  });
});

// Function to update star colors based on selected rating
function updateStarColors() {
  document.querySelectorAll(".star").forEach((star) => {
    let value = parseInt(star.getAttribute("data-value"));
    star.style.color = value <= selectedRating ? "#facc15" : "#9ca3af"; // Yellow if selected, gray otherwise
  });
}
