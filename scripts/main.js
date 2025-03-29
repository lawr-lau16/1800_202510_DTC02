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

// Take the selectedSpotID (when clicking a pin) and calls saveToFavorites(parkingSpotID) to store it
function addFavorite() {
  console.log(
    "Attempting to save favorite. Selected Spot ID:",
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
      let favoriteList = document.getElementById("favoriteList");
      let renderedFavorites = new Set();

      db.collection("users")
        .doc(userID)
        .collection("favorites")
        .onSnapshot((snapshot) => {
          favoriteList.innerHTML = ""; // Clear current list
          renderedFavorites.clear();   // Clear previous render tracking

          snapshot.forEach((doc) => {
            let favSpot = doc.data();
            let spotID = favSpot.parkingSpotID;

            db.collection("parking_spots")
              .doc(spotID)
              .get()
              .then((spotDoc) => {
                if (spotDoc.exists && !renderedFavorites.has(spotID)) {
                  renderedFavorites.add(spotID); // ✅ Now added after successful render

                  let spotData = spotDoc.data();
                  let listItem = document.createElement("li");
                  listItem.classList.add("flex", "justify-between", "items-center");

                  const nameSpan = document.createElement("span");
                  nameSpan.textContent = spotData.name;
                  nameSpan.classList.add("cursor-pointer", "text-blue-600", "hover:underline");

                  nameSpan.addEventListener("click", () => {
                    const marker = markerMap[spotID];
                    if (marker) {
                      selectedSpotID = spotID;
                      marker.togglePopup();
                      map.flyTo({ center: marker.getLngLat() });
                      loadReviewsForSpot(selectedSpotID);

                      const locationNameElement = document.getElementById("locationName");
                      if (locationNameElement) {
                        locationNameElement.textContent = spotData.name;
                        locationNameElement.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spotData.name)}`;
                      }

                      const directionsBtn = document.getElementById("getDirectionsBtn");
                      if (directionsBtn) {
                        const directionsURL = `https://www.google.com/maps/dir/?api=1&destination=${spotData.latitude},${spotData.longitude}`;
                        directionsBtn.classList.remove("hidden");
                        directionsBtn.onclick = () => {
                          window.open(directionsURL, "_blank");
                        };
                      }
                    } else {
                      alert("Marker not found.");
                    }
                  });

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
