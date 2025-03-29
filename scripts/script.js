function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("User logged out.");
      window.location.href = "../index.html"; // Redirect to homepage
    })
    .catch((error) => {
      console.error("Logout error:", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
});

firebase.auth().onAuthStateChanged((user) => {
  const logo = document.getElementById("logo");
  if (user && logo) {
    logo.classList.add("hidden");
  }
});
