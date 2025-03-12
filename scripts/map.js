// Set up Mapbox
mapboxgl.accessToken =
  "pk.eyJ1IjoiZ3VycHJlZXRzaW5naDk0MTQiLCJhIjoiY204NjlnNmdsMDF4cjJpcHFrdWczYXRyYSJ9.aQSt4ydGc7sjLgC4VodRdg"; // Replace with your actual token

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [-122.964274, 49.236082],
  zoom: 10,
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
let searchLocationMarker = null;

// Handle search result
geocoder.on("result", (e) => {
  searchLocation = e.result.geometry.coordinates;
  searchLocationName = e.result.text;

  console.log("Searched Location:", searchLocationName, searchLocation);

  // Remove previous marker if exists
  if (searchLocationMarker) searchLocationMarker.remove();

  // Add new marker
  searchLocationMarker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(searchLocation)
    .addTo(map);

  map.flyTo({ center: searchLocation });

  // Update UI with location details
  document.getElementById("locationName").textContent = searchLocationName;

  // Load reviews for this location
  loadReviews();
});

// Save to Favorites
function saveToFavorites() {
  if (!searchLocation) return alert("Search for a location first!");

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  let newFavorite = {
    name: searchLocationName,
    coordinates: searchLocation,
  };

  // Avoid duplicates
  if (!favorites.some((fav) => fav.name === newFavorite.name)) {
    favorites.push(newFavorite);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    loadFavorites();
  }
}

// Load Favorites
function loadFavorites() {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  let list = document.getElementById("favoriteList");
  list.innerHTML = "";
  favorites.forEach((fav) => {
    let li = document.createElement("li");
    li.textContent = fav.name;
    li.onclick = () => {
      searchLocation = fav.coordinates;
      searchLocationName = fav.name;
      document.getElementById("locationName").textContent = searchLocationName;
      map.flyTo({ center: searchLocation });
    };
    list.appendChild(li);
  });
}

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

// Load favorites on startup
loadFavorites();
