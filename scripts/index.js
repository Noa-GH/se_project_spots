// Getting Els for Edit Buttons
const editProfileModalButton = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileModalCloseButton = editProfileModal.querySelector(
  ".modal__close-button"
);
const editProfileModalForm = editProfileModal.querySelector(".modal__form");
const editProfileModalInputName = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileModalInputDescription = editProfileModal.querySelector(
  "#profile-description-input"
);

// Getting Els for New Post Button
const addModalButton = document.querySelector(".profile__add-btn");
const addModal = document.querySelector("#newPost-modal");
const addModalCloseButton = addModal.querySelector(".modal__close-button");
const addModalForm = addModal.querySelector(".modal__form");
const addModalInputImage = addModal.querySelector("#card-image-input");
const addModalInputCaption = addModal.querySelector("#card-caption-input");

// Debug: Check if close buttons are found
console.log("Edit modal close button:", editProfileModalCloseButton);
console.log("Add modal close button:", addModalCloseButton);

// Getting Els for text content
const editProfileNameEl = document.querySelector(".profile__name");
const editProfileDescriptionEl = document.querySelector(
  ".profile__description"
);

// Function to close edit profile modal with smooth transition
function closeEditProfileModal() {
  editProfileModal.classList.add("modal_is-closing");

  // Wait for animation to complete before removing the opened class
  setTimeout(() => {
    editProfileModal.classList.remove("modal_is-opened");
    editProfileModal.classList.remove("modal_is-closing");
  }, 300); // Match this duration with your CSS transition
}

// Function to close add modal with smooth transition
function closeAddModal() {
  addModal.classList.add("modal_is-closing");

  // Wait for animation to complete before removing the opened class
  setTimeout(() => {
    addModal.classList.remove("modal_is-opened");
    addModal.classList.remove("modal_is-closing");
  }, 300); // Match this duration with your CSS transition
}

editProfileModalButton.addEventListener("click", function () {
  editProfileModalInputName.value = editProfileNameEl.textContent;
  editProfileModalInputDescription.value = editProfileDescriptionEl.textContent;
  editProfileModal.classList.add("modal_is-opened");
});

editProfileModalCloseButton.addEventListener("click", closeEditProfileModal);

addModalButton.addEventListener("click", function () {
  addModal.classList.add("modal_is-opened");
});

addModalCloseButton.addEventListener("click", closeAddModal);

function handleEditProfileSubmit(e) {
  e.preventDefault();
  editProfileNameEl.textContent = editProfileModalInputName.value;
  editProfileDescriptionEl.textContent = editProfileModalInputDescription.value;
  console.log("submitting");

  // Close modal after successful submit
  closeEditProfileModal();
}

function handleNewPostSubmit(e) {
  e.preventDefault();

  // Get form data
  const imageUrl = addModalInputImage.value;
  const caption = addModalInputCaption.value;

  // Log the form data to console
  console.log("New Post Submission:", {
    imageUrl: imageUrl,
    caption: caption,
    // timestamp: new Date().toISOString(),
  });

  // Close modal after successful submit
  closeAddModal();

  // Optional: Reset form
  addModalForm.reset();
}

// Close modal when clicking outside of it
editProfileModal.addEventListener("click", function (e) {
  // Only close if clicking on the modal backdrop (not the modal content)
  if (e.target === editProfileModal) {
    closeEditProfileModal();
  }
});

// Close add modal when clicking outside of it
addModal.addEventListener("click", function (e) {
  // Only close if clicking on the modal backdrop (not the modal content)
  if (e.target === addModal) {
    closeAddModal();
  }
});

editProfileModalForm.addEventListener("submit", handleEditProfileSubmit);
addModalForm.addEventListener("submit", handleNewPostSubmit);
