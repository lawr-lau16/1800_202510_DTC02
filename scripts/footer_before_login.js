function logoutUser() {
    firebase.auth().signOut().then(() => {
        // No need to manually reload footer - auth listener will handle it
        window.location.href = "index.html"; // Full refresh ensures clean state
    }).catch((error) => {
        console.error("Error logging out:", error);
    });
}
