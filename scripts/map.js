//  Set the access token for Mapbox (required for map to work)
mapboxgl.accessToken =
  "pk.eyJ1IjoiZ3VycHJlZXRzaW5naDk0MTQiLCJhIjoiY204NjlnNmdsMDF4cjJpcHFrdWczYXRyYSJ9.aQSt4ydGc7sjLgC4VodRdg";

// Initialize the map inside the container with ID "map"
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  // Coordinates for downtown Vancouver
  center: [-123.1207, 49.2827], 
  // Closer zoom level
  zoom: 13, 
});

// Global variable for currently selected pin
let selectedSpotID = null;

// Mapbox zoom controls
map.addControl(new mapboxgl.NavigationControl(), "top-left");

// Add a Mapbox search bar (geocoder)
const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  placeholder: "Search for a location",
});
map.addControl(geocoder);

// Store search location and name
let searchLocation = null;
let searchLocationName = "";

// Store new marker after search
let searchLocationMarker;
geocoder.on("result", ({ result }) => {
  searchLocation = result.geometry.coordinates;
  searchLocationName = result.text;
  searchLocationMarker?.remove();
  searchLocationMarker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(searchLocation)
    .addTo(map);

  map.flyTo({ center: searchLocation });

  // Update UI with location details
  document.getElementById("locationName").textContent = searchLocationName;

  // Load reviews for this location
  loadReviews();
});


// Submit review for parking spot
function submitReview() {
  const reviewText = document.getElementById("reviewInput").value.trim();

  // Check if a parking spot is selected
  if (!selectedSpotID) {
    alert("Please select a parking spot first!");
    return;
  }

  // Check if text is empty
  if (!reviewText) {
    alert("Please enter a review!");
    return;
  }

  // Check if stars are selected
  if (selectedRating === 0) {
    alert("Please select a star rating!");
    return;
  }

  // Check if user is logged in
  const user = firebase.auth().currentUser;
  if (!user) {
    alert("You must be logged in to submit a review.");
    return;
  }

  // Add review to 'reviews' collection in Firestore
  db.collection("reviews")
    .add({
      spotID: selectedSpotID,
      text: reviewText,
      rating: selectedRating,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      // userID used to allow deleting personal reviews
      userID: user.uid,
    })
    // Popup if submitted succesfully
    .then(() => {
      alert("Review submitted successfully!");
      // Clear inputs and refresh reviews
      document.getElementById("reviewInput").value = "";
      selectedRating = 0;
      updateStarColors();
      loadReviewsForSpot(selectedSpotID); // Refresh review list
    })
    // Popup if error
    .catch((error) => {
      console.error("Error submitting review:", error);
      alert("Something went wrong. Please try again.");
    });
}


// Load reviews for the selected pin
function loadReviewsForSpot(spotID) {
  const reviewList = document.getElementById("reviewList");
  // Clear old reviews
  reviewList.innerHTML = "";

  // Check if the user is logged in
  firebase.auth().onAuthStateChanged((user) => {
    // Store userID if logged in, else null
    const currentUserID = user ? user.uid : null;

    // Query firestore for reviews on selected spot
    db.collection("reviews")
      .where("spotID", "==", spotID)
      // Sort newest to oldest
      .orderBy("timestamp", "desc")
      .get()
      .then((querySnapshot) => {
        // Message if no reviews
        if (querySnapshot.empty) {
          reviewList.innerHTML =
            "<p class='text-gray-600 italic'>No reviews yet for this spot.</p>";
          return;
        }

        // forEach loop through each spot's data
        querySnapshot.forEach((doc) => {
          // Review data
          const data = doc.data();
          // Star data
          const stars = "⭐".repeat(data.rating) + "✩".repeat(5 - data.rating);
          // Main review card
          const reviewEntry = document.createElement("div");
          reviewEntry.className = "p-3 bg-gray-200 rounded-lg shadow space-y-2";
          // Top row with stars and delete button
          const topRow = document.createElement("div");
          topRow.className = "flex justify-between items-center";
          // Add star rating
          const starElem = document.createElement("p");
          starElem.className = "font-semibold text-lg";
          starElem.textContent = stars;
          topRow.appendChild(starElem);

          // Add delete icon if this is the user's review
          if (data.userID === currentUserID) {
            const deleteBtn = document.createElement("button");
            deleteBtn.innerHTML =
              '<i class="fas fa-times text-red-500 hover:text-red-700"></i>';
            deleteBtn.classList.add("ml-2");
            // Delete review in Firestore onclick
            deleteBtn.onclick = () => {
              deleteReview(doc.id);
            };
            topRow.appendChild(deleteBtn);
          }

          // Add top row to review card
          reviewEntry.appendChild(topRow);
          const textElem = document.createElement("p");
          textElem.textContent = data.text;
          reviewEntry.appendChild(textElem);

          // Add reviews to list
          reviewList.appendChild(reviewEntry);
        });
      })
      // Error message if anything goes wrong
      .catch((error) => {
        console.error("Error loading reviews:", error);
      });
  });
}


// Delete rewview from Firestore
function deleteReview(reviewID) {
  // Delete review from Firestore with given reviewID
  db.collection("reviews")
    .doc(reviewID)
    .delete()
    .then(() => {
      // Popup if delete was successful
      alert("Review deleted.");
       // Refresh reviews
      loadReviewsForSpot(selectedSpotID);
    })
    .catch((error) => {
      // Popup if delete was unsuccessful
      console.error("Error deleting review:", error);
      alert("Something went wrong while deleting the review.");
    });
}
