// Submit Review Functionality
document.getElementById("submitReview").addEventListener("click", () => {
    const reviewText = document.getElementById("reviewText").value.trim();
    const selectedRating = document.getElementById("ratingSelect").value;

    if (reviewText === "") {
        alert("Please write a review before submitting.");
        return;
    }

    if (selectedRating === "0") {
        alert("Please select a rating before submitting.");
        return;
    }

    // Add review to Firestore
    db.collection("reviews")
        .add({
            text: reviewText,
            rating: parseInt(selectedRating), // Convert to number
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
            alert("Review submitted successfully!");
            document.getElementById("reviewText").value = ""; // Clear the text box
            document.getElementById("ratingSelect").value = "1"; // Reset dropdown to default
        })
        .catch((error) => {
            console.error("Error submitting review: ", error);
            alert("An error occurred while submitting the review. Please try again.");
        });
});