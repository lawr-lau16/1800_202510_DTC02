// Set up Mapbox
mapboxgl.accessToken =
  "pk.eyJ1IjoiZ3VycHJlZXRzaW5naDk0MTQiLCJhIjoiY204NjlnNmdsMDF4cjJpcHFrdWczYXRyYSJ9.aQSt4ydGc7sjLgC4VodRdg"; // Replace with your actual token

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [-123.1207, 49.2827], // Coordinates for downtown Vancouver
    zoom: 13, // Closer zoom level
  });

// Global variable to be accessed
let selectedSpotID = null;


map.addControl(new mapboxgl.NavigationControl(), "top-left");

// Add search bar
const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  placeholder: "Search for a location",
});

map.addControl(geocoder);

let searchLocation = null;
let searchLocationName = "";

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


function submitReview() {
  const reviewText = document.getElementById("reviewInput").value.trim();

  if (!selectedSpotID) {
    alert("Please select a parking spot first!");
    return;
  }

  if (!reviewText) {
    alert("Please enter a review!");
    return;
  }

  if (selectedRating === 0) {
    alert("Please select a star rating!");
    return;
  }

  const user = firebase.auth().currentUser;
  if (!user) {
    alert("You must be logged in to submit a review.");
    return;
  }

  db.collection("reviews")
    .add({
      spotID: selectedSpotID,
      text: reviewText,
      rating: selectedRating,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      userID: user.uid,
    })
    .then(() => {
      alert("Review submitted successfully!");
      document.getElementById("reviewInput").value = "";
      selectedRating = 0;
      updateStarColors();
      loadReviewsForSpot(selectedSpotID); // Refresh review list
    })
    .catch((error) => {
      console.error("Error submitting review:", error);
      alert("Something went wrong. Please try again.");
    });
}




// Function to load reviews for the selected pin
function loadReviewsForSpot(spotID) {
  const reviewList = document.getElementById("reviewList");
  reviewList.innerHTML = ""; // Clear old reviews

  db.collection("reviews")
    .where("spotID", "==", spotID)
    .orderBy("timestamp", "desc")
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        reviewList.innerHTML = "<p class='text-gray-600 italic'>No reviews yet for this spot.</p>";
        return;
      }

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const stars = "⭐".repeat(data.rating) + "☆".repeat(5 - data.rating);
        const reviewEntry = document.createElement("div");
        reviewEntry.className = "p-3 bg-gray-200 rounded-lg shadow";

        reviewEntry.innerHTML = `
          <p class="font-semibold text-lg">${stars}</p>
          <p>${data.text}</p>
        `;
        reviewList.appendChild(reviewEntry);
      });
    })
    .catch((error) => {
      console.error("Error loading reviews:", error);
    });
}  

window.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.querySelector("button[onclick='submitReview()']");
  if (submitBtn) {
    submitBtn.addEventListener("click", submitReview);
  } else {
    console.warn("⚠️ Submit Review button not found!");
  }
});

