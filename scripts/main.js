function getNameFromAuth() {
  // Check if a user is signed in
  firebase.auth().onAuthStateChanged((user) => {
    // If user is logged in
    if (user) {
      const userName = user.displayName || "User";

      // Update lg responsive placeholder
      const userNameElement = document.getElementById("name-goes-here");
      if (userNameElement) userNameElement.innerText = `${userName}`;

      // Update sm responsive placeholder
      const userNameMobileElement = document.getElementById("name-goes-here-mobile");
      if (userNameMobileElement) userNameMobileElement.innerText = `${userName}`;

      // If no user is signed in.
    } else {
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

getNameFromAuth();


// Check if user is logged in. Saves the parkingSpotID under the user's favorite collection.
function saveToFavorites(parkingSpotID) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      let userID = user.uid;

      // Save the favorite under: users/{userID}/favorites/{parkingSpotID}
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

    // If user is not logged in
    } else {
      alert("You need to be logged in to save favorites.");
    }
  });
}


// Take the selectedSpotID (when clicking a pin) and calls saveToFavorites(parkingSpotID) to store it
function addFavorite() {

  // If no parking spot has been selected
  if (!selectedSpotID) {
    alert("Select a parking spot first!");
    return;
  }

  // Else, save selected parking spot to user's favorites
  saveToFavorites(selectedSpotID);
}


// Loads and displays the logged-in user's list of favorite parking spots, and updates favorites list if there are changes
function loadFavorites() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      let userID = user.uid;

      // Save list of favorite spots
      let favoriteList = document.getElementById("favoriteList");

      // Prevent duplicates
      let renderedFavorites = new Set();

      // Check for updates to user's favorites
      db.collection("users")
        .doc(userID)
        .collection("favorites")
        .onSnapshot((snapshot) => {
          // Clear previous favorites list before updating with new list
          favoriteList.innerHTML = "";
          renderedFavorites.clear();

          // Loop through each favorite spot
          snapshot.forEach((doc) => {
            let favSpot = doc.data();
            let spotID = favSpot.parkingSpotID;

            // Retrieve parking spot data
            db.collection("parking_spots")
              .doc(spotID)
              .get()
              .then((spotDoc) => {
                if (spotDoc.exists && !renderedFavorites.has(spotID)) {
                  renderedFavorites.add(spotID);

                  let spotData = spotDoc.data();
                  // Create <li> element for favorite
                  let listItem = document.createElement("li");
                  listItem.classList.add("flex", "justify-between", "items-center");

                  // Make parking spot name clickable
                  const nameSpan = document.createElement("span");
                  nameSpan.textContent = spotData.name;
                  nameSpan.classList.add("cursor-pointer", "text-blue-600", "hover:underline");

                  // When user clicks the spot name...
                  nameSpan.addEventListener("click", () => {
                    const marker = markerMap[spotID];
                    if (marker) {
                      // selectedSpotID as the active spot
                      selectedSpotID = spotID;
                      marker.togglePopup();
                      // Popup and reposition map to pin
                      map.flyTo({ center: marker.getLngLat() });
                      // Reload reviews for this pin
                      loadReviewsForSpot(selectedSpotID);

                      // Update location name
                      const locationNameElement = document.getElementById("locationName");
                      if (locationNameElement) {
                        locationNameElement.textContent = spotData.name;
                        locationNameElement.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spotData.name)}`;
                      }

                      // Add 'Get Directions' Button
                      const directionsBtn = document.getElementById("getDirectionsBtn");
                      if (directionsBtn) {
                        // Add lat and long to google maps link
                        const directionsURL = `https://www.google.com/maps/dir/?api=1&destination=${spotData.latitude},${spotData.longitude}`;
                        directionsBtn.classList.remove("hidden");
                        directionsBtn.onclick = () => {
                          window.open(directionsURL, "_blank");
                        };
                      }
                      // Error if no marker is clicked
                    } else {
                      alert("Marker not found.");
                    }
                  });

                  // Create x button to delete favorited parking spots
                  const deleteBtn = document.createElement("button");
                  deleteBtn.innerHTML = '<i class="fas fa-times text-red-500 hover:text-red-700"></i>';
                  deleteBtn.classList.add("ml-2");
                  deleteBtn.onclick = () => deleteFavorite(spotID);

                  listItem.appendChild(nameSpan);
                  listItem.appendChild(deleteBtn);
                  favoriteList.appendChild(listItem);
                }
              });
          });
        });
    }
  });
}


// Delete user favorite, and remove from users Firestore
function deleteFavorite(parkingSpotID) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const userID = user.uid;

      // Delete selected favorite from Firestore
      db.collection("users")
        .doc(userID)
        .collection("favorites")
        .doc(parkingSpotID)
        .delete()
        .then(() => {
          console.log("Favorite deleted successfully!");
          alert("Favorite has been successfully removed.");
        })
        .catch((error) => {
          console.error("Error removing favorite: ", error);
          alert("Something went wrong while deleting. Please try again.");
        });
    }
  });
}

// Call function on page load
loadFavorites();


let selectedRating = 0;
// Function to handle star clicks. eventListener to each star
document.querySelectorAll(".star").forEach((star) => {
  star.addEventListener("click", function () {
    // Get star value
    selectedRating = parseInt(this.getAttribute("data-value"));
    // Update star colors
    updateStarColors();
  });
});

// Function to update star colors based on selected rating
function updateStarColors() {
  document.querySelectorAll(".star").forEach((star) => {
    let value = parseInt(star.getAttribute("data-value"));
    // Yellow if selected, gray otherwise
    star.style.color = value <= selectedRating ? "#facc15" : "#9ca3af"; 
  });
}
