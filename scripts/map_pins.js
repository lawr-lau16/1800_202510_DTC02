// Ensure the script runs only after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    loadParkingSpots(); // Ensures the function runs after the page loads
});

// Function to save a parking spot to Firestore
function saveParkingSpot(name, latitude, longitude) {
    db.collection("parking_spots").add({
        name: name,
        latitude: latitude,
        longitude: longitude,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        console.log("Parking spot added successfully!");
    })
    .catch(error => {
        console.error("Error adding parking spot: ", error);
    });
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
            marker.getElement().dataset.name = spot.name; // Store name for access later

            // Handle marker click event
            marker.getElement().addEventListener("click", function () {
                selectedSpotID = this.dataset.id; // Get the saved spot ID
                let selectedSpotName = this.dataset.name; // Get the saved name

                let locationNameElement = document.getElementById("locationName");
                if (locationNameElement) {
                    locationNameElement.innerText = selectedSpotName; // Use dataset name
                } else {
                    console.error("❌ 'locationName' element not found. Make sure it exists in main.html!");
                }
                console.log("✅ Selected Spot ID Set:", selectedSpotID);
            });
        });
    });
}

// Call this function when the page loads
loadParkingSpots();
