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

        // Wait just a moment to ensure DOM is loaded
        setTimeout(() => {
          const locationNameElement = document.getElementById("locationName");
          if (locationNameElement) {
            locationNameElement.textContent = selectedSpotName + " 📍";
            const encodedName = encodeURIComponent(selectedSpotName);
            locationNameElement.href = `https://www.google.com/maps/search/?api=1&query=${encodedName}`;
          }

          // ✅ Show and configure the Get Directions button
          const directionsBtn = document.getElementById("getDirectionsBtn");
          if (directionsBtn) {
            const directionsURL = `https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`;
            directionsBtn.classList.remove("hidden");
            directionsBtn.onclick = () => {
              window.open(directionsURL, "_blank");
            };
          }

          const reviewList = document.getElementById("reviewList");
          if (!reviewList) {
            console.error(
              "❌ 'reviewList' element not found. Check your main.html."
            );
            return;
          }

          console.log("✅ Selected Spot ID Set:", selectedSpotID);
          loadReviewsForSpot(selectedSpotID);
        }, 100);
      });
    }); // ✅ This closes querySnapshot.forEach
  });
}
loadParkingSpots()