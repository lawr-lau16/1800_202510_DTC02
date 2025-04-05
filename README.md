# ParkPal

## Overview
ParkPal is a full-stack web application designed to solve the common urban challenge of finding convenient and safe parking spots. Drivers often struggle with unreliable information, difficulty navigating to available spots, and uncertainty about safety. ParkPal addresses these issues with an interactive, user-friendly parking map interface that displays verified spots, reviews, and directions.

This app was developed as part of the BCIT CST Program to demonstrate real-world application of REST APIs, Firebase, Firestore, Mapbox, JavaScript, and responsive design principles. ParkPal is built with the mindset: *"By drivers, for drivers."*

---

## Features
- View nearby parking spots on an interactive Mapbox-powered map.
- Add new parking spots (private) and store them in Firebase.
- Search for locations and get Google Maps directions.
- Save favorite parking locations.
- Submit and view user-generated reviews and ratings.
- Auth system with login/logout and session-based rendering.
- Responsive design for mobile and desktop.

---

## Technologies Used

- **Frontend**: HTML, Tailwind CSS, JavaScript
- **Backend**: Firebase Authentication, Firestore Database
- **Map Integration**: Mapbox GL JS, Mapbox Geocoder
- **Hosting**: Firebase Hosting
- **Design Assets**: FontAwesome for icons

---

## Usage

1. Clone the repo and host the files via Firebase or locally.
2. Sign up or log in with your account.
3. Search a location using the Mapbox search bar.
4. Click on pins to see reviews or submit your own.
5. Use the **"Get Directions"** button to navigate to a parking spot.
6. Add favorite spots or create your own private parking entries.

---

## Project Structure

### 📁 `scripts/` — JavaScript Logic

| File | Description |
|------|-------------|
| `authentication.js` | Handles Firebase Authentication (signup/login/logout and session logic). |
| `before_after_navbar.js` | Controls switching between login and logout navbars. *(May be legacy)* |
| `footer_before_login.js` | Loads guest footer dynamically if user isn't logged in. |
| `footer_after_login.js` | Loads logged-in user footer dynamically. |
| `main.js` | General app logic (possibly homepage loading, shared setup). |
| `map_pins.js` | Handles creation and loading of parking pins on the map. |
| `map.js` | Initializes Mapbox map and controls map display behavior. |
| `nav_after_login.js` | Loads and updates the navigation bar for authenticated users. |
| `nav_before_login.js` | Loads guest navigation bar for unauthenticated visitors. |
| `script.js` | Main controller for user reviews, star rating, and UI interaction. |

---

### 📁 `text/` — Dynamic HTML Snippets

| File | Description |
|------|-------------|
| `footer_after_login.html` | Footer visible to logged-in users. |
| `footer_before_login.html` | Footer for visitors/guests (not logged in). |
| `nav_after_login.html` | Navigation bar for authenticated users. |
| `nav_before_login.html` | Navigation bar for unauthenticated visitors. |
| `navbar_template.html` | Reusable navbar structure (possibly unused or base for nav logic). |

---

### 📁 `old_files_safe_to_delete/`

| File | Description |
|------|-------------|
| `footer.html` | Static footer (no longer used; replaced by dynamic versions). |
| `user_information.html` | Outdated user info page. |
| `user_information(no_longer_used).html` | Same as above — a backup or renamed deprecated file. |

---

### 📁 `Logo/`

| File | Description |
|------|-------------|
| *logo1.png* | Stores branding images used in the UI (logo, favicons, etc.). |

---

### 📄 Root HTML Pages

| File | Description |
|------|-------------|
| `index.html` | Main homepage of ParkPal — shows the interactive parking map. |
| `contact_us.html` | Contact page with form and support info. |
| `aboutus.html` | Information about the project and the team. |
| `login.html` | Login/Signup interface for users. |
| `main.html` | Possibly a dashboard or landing page after login. |
| `404.html` | Custom 404 error page for broken routes. |
| `template.html` | A base layout possibly used for templating or reused in other files. |

---

### 📄 Config and Firebase Files

| File | Description |
|------|-------------|
| `.firebaserc` | Firebase project config (project alias/settings). |
| `.gitignore` | Files and folders to exclude from Git tracking. |
| `firebase.json` | Firebase hosting/deployment rules and settings. |
| `firestore.indexes.json` | Index rules for Firestore (queries, filters). |
| `firestore.rules` | Firestore database access rules (read/write permissions). |
| `tailwind.config.js` | Tailwind CSS configuration (custom themes, colors, etc.). |
| `package.json` | Lists dependencies and scripts for the project. |
| `package-lock.json` | Dependency tree snapshot (exact versions). |

---

## Contributors
- **Gurpreet Singh** – I'm Gurpreet Singh, a passionate web developer and CST student at BCIT!
- **Niga Mushir** – CST student at BCIT Downtown campus.
- **Lawrence Lau** – New BCIT CST student. Let’s build this app!

---

## Acknowledgments

- Map integration by [Mapbox](https://www.mapbox.com/)
- User authentication and hosting by [Firebase](https://firebase.google.com/)
- UI icons from [FontAwesome](https://fontawesome.com/)
- JavaScript and Firebase code patterns inspired by [MDN Web Docs](https://developer.mozilla.org/)

---

## Limitations and Future Work

### Limitations
- Private parking data is only visible to the creator.
- Currently supports manual parking pin creation only.
- Limited sorting and filtering options in reviews.

### Future Work
- Implement real-time spot availability using IoT/GPS data.
- Add filtering by price, hours, and accessibility.
- Integrate user-based trust ratings for reviews.
- Add dark mode and voice command support.

