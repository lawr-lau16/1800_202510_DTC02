// Set up Mapbox
mapboxgl.accessToken =
  "pk.eyJ1IjoiZ3VycHJlZXRzaW5naDk0MTQiLCJhIjoiY204NjlnNmdsMDF4cjJpcHFrdWczYXRyYSJ9.aQSt4ydGc7sjLgC4VodRdg"; // Replace with your actual token

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [-123.1207, 49.2827], // Coordinates for downtown Vancouver
    zoom: 13, // Closer zoom level
  });

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

// Submit Review
function submitReview() {
  if (!searchLocation) return alert("Search for a location first!");

  let reviewText = document.getElementById("reviewInput").value;
  if (!reviewText) return alert("Enter a review!");

  let reviews = JSON.parse(localStorage.getItem("reviews")) || {};
  if (!reviews[searchLocationName]) reviews[searchLocationName] = [];

  reviews[searchLocationName].push(reviewText);
  localStorage.setItem("reviews", JSON.stringify(reviews));

  document.getElementById("reviewInput").value = "";
  loadReviews();
}

// Load Reviews
function loadReviews() {
  let reviews = JSON.parse(localStorage.getItem("reviews")) || {};
  let list = document.getElementById("reviewList");
  list.innerHTML = "";

  if (reviews[searchLocationName]) {
    reviews[searchLocationName].forEach((review) => {
      let div = document.createElement("div");
      div.className = "review";
      div.textContent = review;
      list.appendChild(div);
    });
  }
}
