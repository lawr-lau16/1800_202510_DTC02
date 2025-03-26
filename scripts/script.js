
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
