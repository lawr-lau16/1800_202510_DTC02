const markerMap = {}; // Global map of parkingSpotID to marker


// Create and save new private parking spot to the Firestore
function createSpot() {
  //Name of the parking spot from the input field
  const name = document.getElementById("spotName").value.trim();

  // Alert if name or searchLocation is empty
  if (!name || !searchLocation) {
    alert("Please enter a spot name and select a location.");
    return;
  }

  // Get current user, alert if missing
  const user = firebase.auth().currentUser;
  if (!user) {
    alert("You must be logged in to create a parking spot.");
    return;
  }

  // Latitude and longitude data from location
  const lat = searchLocation[1];
  const lng = searchLocation[0];

  // Store parking_spots in Firestore
  db.collection("parking_spots")
    .add({
      name: name,
      latitude: lat,
      longitude: lng,
      userID: user.uid,
      visibility: "private",
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      // Popup if save successful
      alert("Private parking spot saved!");
    })
    .catch((error) => {
      // Popup if save unsuccessful
      console.error("Error saving spot:", error);
      alert("Something went wrong.");
    });
}


// Load parking spots from Firestore
function loadParkingSpots() {
  // Wait and check for authenication
  firebase.auth().onAuthStateChanged((user) => {
    // Do not load if user not logged in
    if (!user) return;

    // Snapshot real-time updates to parking_spots
    db.collection("parking_spots").onSnapshot((querySnapshot) => {
      // forEach loop trhough each spot's data
      querySnapshot.forEach((doc) => {
        let spot = doc.data();

        // Skip private spots not owned by the current user
        if (spot.visibility === "private" && spot.userID !== user.uid) return;

        // Pick colors for map pins
        let markerColor = spot.visibility === "private" ? "#3270C3" : "#0C2F70";

        // Creating new parking spots
        let marker = new mapboxgl.Marker({ color: markerColor })
          // Set marker position on map
          .setLngLat([spot.longitude, spot.latitude])
          // Create popup with position name
          .setPopup(new mapboxgl.Popup().setText(spot.name))
          // Add marker to map
          .addTo(map);

        // Save marker to map using doc.id
        markerMap[doc.id] = marker;

        marker.getElement().dataset.id = doc.id;
        marker.getElement().dataset.name = spot.name;

        // EventListener for each marker
        marker.getElement().addEventListener("click", function () {
          // Save selected marker's information on click
          selectedSpotID = this.dataset.id;
          let selectedSpotName = this.dataset.name;

          // Need to add delay here or bugs out...
          setTimeout(() => {
            // Update location name on sidebar
            const locationNameElement = document.getElementById("locationName");
            if (locationNameElement) {
              locationNameElement.textContent = selectedSpotName;
              locationNameElement.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                selectedSpotName
              )}`;
            }

            // Add Get Directions button under name in sidebar
            const directionsBtn = document.getElementById("getDirectionsBtn");
            if (directionsBtn) {
              const directionsURL = `https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`;
              directionsBtn.classList.remove("hidden");
              directionsBtn.onclick = () =>
                // Open Google maps in new tab on click
                window.open(directionsURL, "_blank");
            }

            // Need to add delay here or bugs out...
            loadReviewsForSpot(selectedSpotID);}, 100);
        });
      });
    });
  });
}

loadParkingSpots();
