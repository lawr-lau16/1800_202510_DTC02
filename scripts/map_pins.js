const markerMap = {}; // Global map of parkingSpotID to marker

function createSpot() {
  const name = document.getElementById("spotName").value.trim();

  if (!name || !searchLocation) {
    alert("Please enter a spot name and select a location.");
    return;
  }

  const user = firebase.auth().currentUser;
  if (!user) {
    alert("You must be logged in to create a parking spot.");
    return;
  }

  const lat = searchLocation[1];
  const lng = searchLocation[0];

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
      alert("Private parking spot saved!");
    })
    .catch((error) => {
      console.error("Error saving spot:", error);
      alert("Something went wrong.");
    });
}


function loadParkingSpots() {
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) return;

    db.collection("parking_spots").onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let spot = doc.data();

        // Skip private spots not owned by the current user
        if (spot.visibility === "private" && spot.userID !== user.uid) return;

        // Choose color
        let markerColor = spot.visibility === "private" ? "purple" : "blue";

        let marker = new mapboxgl.Marker({ color: markerColor })
          .setLngLat([spot.longitude, spot.latitude])
          .setPopup(new mapboxgl.Popup().setText(spot.name))
          .addTo(map);

        markerMap[doc.id] = marker;

        marker.getElement().dataset.id = doc.id;
        marker.getElement().dataset.name = spot.name;

        marker.getElement().addEventListener("click", function () {
          selectedSpotID = this.dataset.id;
          let selectedSpotName = this.dataset.name;

          setTimeout(() => {
            const locationNameElement = document.getElementById("locationName");
            if (locationNameElement) {
              locationNameElement.textContent = selectedSpotName;
              locationNameElement.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedSpotName)}`;
            }

            const directionsBtn = document.getElementById("getDirectionsBtn");
            if (directionsBtn) {
              const directionsURL = `https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`;
              directionsBtn.classList.remove("hidden");
              directionsBtn.onclick = () => window.open(directionsURL, "_blank");
            }

            loadReviewsForSpot(selectedSpotID);
          }, 100);
        });
      });
    });
  });
}



loadParkingSpots()