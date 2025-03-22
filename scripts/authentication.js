// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      const user = authResult.user;
      console.log("User signed in:", user);

      // Display the user's name
      displayUserName(user);

      // Return true to redirect to the signInSuccessUrl
      return true;
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById("loader").style.display = "none";
    },
  },
  // Use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: "popup",
  signInSuccessUrl: "main.html",
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    // firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
  ],
  // Terms of service url.
  tosUrl: "<your-tos-url>",
  // Privacy policy url.
  privacyPolicyUrl: "<your-privacy-policy-url>",
};

// Start FirebaseUI
ui.start("#firebaseui-auth-container", uiConfig);

// Function to display the user's name
function displayUserName(user) {
  const userNameElement = document.getElementById("userName");
  const userNameMobileElement = document.getElementById("userNameMobile");

  if (user) {
    const displayName = user.displayName || user.email || "User"; // Fallback to email if displayName is not set
    if (userNameElement) userNameElement.textContent = `Welcome, ${displayName}!`;
    if (userNameMobileElement) userNameMobileElement.textContent = `Welcome, ${displayName}!`;
  } else {
    if (userNameElement) userNameElement.textContent = "Welcome, Guest!";
    if (userNameMobileElement) userNameMobileElement.textContent = "Welcome, Guest!";
  }
}

// Listen for auth state changes
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log("User is signed in:", user);
    displayUserName(user); // Display the user's name
  } else {
    console.log("User is signed out");
    displayUserName(null); // Display "Guest"
  }
});