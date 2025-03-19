document.addEventListener("DOMContentLoaded", loadParkingSpots);

function getNameFromAuth() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if a user is signed in:
    if (user) {
      // Do something for the currently logged-in user here:
      console.log(user.uid); //print the uid in the browser console
      console.log(user.displayName); //print the user name in the browser console
      userName = user.displayName;

      //method#1:insert with JS
      document.getElementById("name-goes-here").innerText = userName;

      //method #2:  insert using jquery
      //$("#name-goes-here").text(userName); //using jquery

      //method #3:  insert using querySelector
      //document.querySelector("#name-goes-here").innerText = userName
    } else {
      // No user is signed in.
      console.log("No user is logged in");
    }
  });
}
getNameFromAuth(); //run the function

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

// Submit Review
function submitReview() {
  let reviewText = document.getElementById("reviewInput").value;
  if (!reviewText.trim()) {
    alert("Please enter a review before submitting!");
    return;
  }
  if (selectedRating === 0) {
    alert("Please select a star rating!");
    return;
  }

  // Create Review Entry
  let reviewEntry = document.createElement("div");
  reviewEntry.className = "p-3 bg-gray-200 rounded-lg shadow";

  let starsDisplay =
    "⭐".repeat(selectedRating) + "☆".repeat(5 - selectedRating); // Show stars

  reviewEntry.innerHTML = `
            <p class="font-semibold text-lg">${starsDisplay}</p>
            <p>${reviewText}</p>
        `;

  // Add review to list
  document.getElementById("reviewList").prepend(reviewEntry);

  // Reset fields
  document.getElementById("reviewInput").value = "";
  selectedRating = 0;
  updateStarColors();
}
