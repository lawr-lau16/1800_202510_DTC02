// Ensure the script runs only after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  loadParkingSpots(); // Ensures the function runs after the page loads
});

// Function to save a parking spot to Firestore
function saveParkingSpot(name, latitude, longitude, visibility) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      db.collection("parking_spots").add({
        name: name,
        latitude: latitude,
        longitude: longitude,
        visibility: visibility, // "public" or "private"
        ownerID: user.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
        .then(() => {
          console.log("🚀 Parking spot added!");
        })
        .catch(error => {
          console.error("❌ Error saving parking spot:", error);
        });
    }
  });
}

// Function to trigger saveParkingSpot
function createSpot() {
  const name = document.getElementById("spotName").value;
  const visibility = document.getElementById("visibility").value;

  if (!searchLocation) return alert("Please search a location first!");
  if (!name.trim()) return alert("Please enter a spot name!");

  saveParkingSpot(name, searchLocation[1], searchLocation[0], visibility); // lat, lng
}

// Function to load parking spots from Firestore and display them on the map
function loadParkingSpots() {
  db.collection("parking_spots").onSnapshot((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      let spot = doc.data(); // Get spot details from Firestore
      let marker = new mapboxgl.Marker()
        .setLngLat([spot.longitude, spot.latitude])
        .setPopup(new mapboxgl.Popup().setText(spot.name))
        .addTo(map);

      // Store Firestore document ID and name inside marker dataset
      marker.getElement().dataset.id = doc.id;
      marker.getElement().dataset.name = spot.name;

      // Handle marker click event
      marker.getElement().addEventListener("click", function () {
        selectedSpotID = this.dataset.id;
        let selectedSpotName = this.dataset.name;

        // Wait just a moment to ensure DOM is loaded (esp. reviewList)
        setTimeout(() => {
          const locationNameElement = document.getElementById("locationName");
          if (locationNameElement) {
            locationNameElement.textContent = selectedSpotName + " 📍";
            const encodedName = encodeURIComponent(selectedSpotName);
            locationNameElement.href = `https://www.google.com/maps/search/?api=1&query=${encodedName}`;
          } else {
            console.error("❌ 'locationName' element not found. Check your main.html.");
          }

          const reviewList = document.getElementById("reviewList");
          if (!reviewList) {
            console.error("❌ 'reviewList' element not found. Check your main.html.");
            return;
          }

          console.log("✅ Selected Spot ID Set:", selectedSpotID);
          loadReviewsForSpot(selectedSpotID); // Load the reviews now that the sidebar exists
        }, 100); // Slight delay to allow sidebar DOM elements to be ready
      });
    });
  });
}


// Call this function when the page loads
loadParkingSpots();
