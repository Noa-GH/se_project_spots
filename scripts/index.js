// Getting Elements for Edit Profile Modal
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

// Getting Elements for New Post Modal
const addModalButton = document.querySelector(".profile__add-btn");
const addModal = document.querySelector("#newPost-modal");
const addModalCloseButton = addModal.querySelector(".modal__close-button");
const addModalForm = addModal.querySelector(".modal__form");
const addModalInputImage = addModal.querySelector("#card-image-input");
const addModalInputCaption = addModal.querySelector("#card-caption-input");

// Getting Elements for Profile Content
const editProfileNameEl = document.querySelector(".profile__name");
const editProfileDescriptionEl = document.querySelector(
  ".profile__description"
);

// Reusable Modal Functions
function openModal(modal) {
  modal.classList.add("modal_is-opened");
}

function closeModal(modal) {
  modal.classList.add("modal_is-closing");

  setTimeout(() => {
    modal.classList.remove("modal_is-opened");
    modal.classList.remove("modal_is-closing");
  }, 300);
}

// Generic function to setup modal with all common behaviors
function setupModal(
  modal,
  openButton,
  closeButton,
  form = null,
  submitHandler = null,
  onOpen = null
) {
  // Open modal
  openButton.addEventListener("click", () => {
    if (onOpen) onOpen(); // Run any pre-open logic
    openModal(modal);
  });

  // Close modal via close button
  closeButton.addEventListener("click", () => closeModal(modal));

  // Close modal when clicking outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });

  // Setup form if provided
  if (form && submitHandler) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      submitHandler(e);
      closeModal(modal);
    });
  }
}

// Form Submit Handlers
function handleEditProfileSubmit(e) {
  // Update profile data
  editProfileNameEl.textContent = editProfileModalInputName.value;
  editProfileDescriptionEl.textContent = editProfileModalInputDescription.value;
}

function handleNewPostSubmit(e) {
  // Get form data
  const imageUrl = addModalInputImage.value;
  const caption = addModalInputCaption.value;

  console.log("Image URL:", imageUrl);
  console.log("Caption:", caption);

  // Reset form after submission
  addModalForm.reset();
}

// Pre-open function for edit profile modal
function prepareEditProfileModal() {
  editProfileModalInputName.value = editProfileNameEl.textContent;
  editProfileModalInputDescription.value = editProfileDescriptionEl.textContent;
}

// Initialize Edit Profile Modal
setupModal(
  editProfileModal,
  editProfileModalButton,
  editProfileModalCloseButton,
  editProfileModalForm,
  handleEditProfileSubmit,
  prepareEditProfileModal // This runs before opening the modal
);

// Initialize New Post Modal
setupModal(
  addModal,
  addModalButton,
  addModalCloseButton,
  addModalForm,
  handleNewPostSubmit
);

// Global keyboard handler for all modals
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    // Close any open modal
    document.querySelectorAll(".modal_is-opened").forEach((modal) => {
      closeModal(modal);
    });
  }
});
