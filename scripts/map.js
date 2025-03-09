function showMap() {
  //------------------------------------------
  // Defines and initiates basic mapbox data
  //------------------------------------------
  mapboxgl.accessToken = "..."; //add your own here
  const map = new mapboxgl.Map({
    container: "map", // Container ID
    style: "mapbox://styles/mapbox/streets-v11", // Styling URL
    center: [-122.964274, 49.236082], // Starting position
    zoom: 8.8, // Starting zoom
  });

  // Add user controls to map (compass and zoom) to top left
  var nav = new mapboxgl.NavigationControl();
  map.addControl(nav, "top-left");

  // declare some globally used variables
  var userLocationMarker;
  var searchLocationMarker;
  var userLocation;
  var searchLocation;

  // Get the user's location
  navigator.geolocation.getCurrentPosition(function (position) {
    userLocation = [position.coords.longitude, position.coords.latitude];
    console.log(userLocation);
    console.log(searchLocation);

    // Add a marker to the map at the user's location
    userLocationMarker = new mapboxgl.Marker()
      .setLngLat(userLocation)
      .addTo(map);

    // Center the map on the user's location
    map.flyTo({
      center: userLocation,
    });
  });

  // Add the MapboxGeocoder search box to the map
  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    types: "country,region,place,postcode,locality,neighborhood,address",
    mapboxgl: mapboxgl,
  });
  map.addControl(geocoder);

  // Listen for the 'result' event from the geocoder (when a search is made)
  geocoder.on("result", function (e) {
    searchLocation = e.result.geometry.coordinates;
    console.log(userLocation);
    console.log(searchLocation);

    // Add a marker to the map at the search location
    searchLocationMarker && searchLocationMarker.remove(); // Remove the previous search marker if it exists
    searchLocationMarker = new mapboxgl.Marker({ color: "red" })
      .setLngLat(searchLocation)
      .addTo(map);

    // Fit the map to include both the user's location and the search location
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend(userLocation);
    bounds.extend(searchLocation);

    map.fitBounds(bounds, {
      padding: {
        top: 100,
        bottom: 50,
        left: 100,
        right: 50,
      }, // Add some padding so that markers aren't at the edge or blocked
    });
  });
}

showMap();
