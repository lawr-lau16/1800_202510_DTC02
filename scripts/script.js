// JavaScript for log out button
function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("User logged out.");
      window.location.href = "../index.html"; // Redirect to homepage
    })
    .catch((error) => {
      console.error("Logout error:", error); // Log any logout errors
    });
}

//Runs after the HTML content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Get references to the mobile menu button and menu itself
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  // Toggle the mobile menu visibility when the menu button is clicked
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden"); // Show/hide mobile menu
  });
});

// Automatically runs whenever authentication state changes (user logs in/out)
firebase.auth().onAuthStateChanged((user) => {
  const logo = document.getElementById("logo");

  // If a user is logged in and the logo element exists, hide the logo
  if (user && logo) {
    logo.classList.add("hidden");
  }
});
