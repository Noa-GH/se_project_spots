// script.js (or whatever you named your JS file)
function openModal(modalId) {
  document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
  // Clear form inputs
  const form = document.querySelector(`#${modalId} form`);
  if (form) form.reset();
}

function handleEditProfile(event) {
  event.preventDefault();
  const name = document.getElementById("profile-name-input").value;
  const description = document.getElementById(
    "profile-description-input"
  ).value;

  console.log("Profile updated:", { name, description });
  alert("Profile updated successfully!");
  closeModal("editProfile-modal");
}

function handleNewPost(event) {
  event.preventDefault();
  const imageUrl = document.getElementById("card-image-input").value;
  const caption = document.getElementById("card-caption-input").value;

  console.log("New post created:", { imageUrl, caption });
  alert("New post created successfully!");
  closeModal("newPost-modal");
}

// Close modal when clicking outside of it
window.onclick = function (event) {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
  }
};
