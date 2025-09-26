const initialCards = [
  {
    name: "Val Thorens",
    link: "./images/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "./images/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "./images/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long over the forest and through trees",
    link: "./images/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "./images/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "./images/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

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

// Close add modal when clicking outside of it
addModal.addEventListener("click", function (e) {
  // Only close if clicking on the modal backdrop (not the modal content)
  if (e.target === addModal) {
    closeAddModal();
  }
});

editProfileModalForm.addEventListener("submit", handleEditProfileSubmit);
addModalForm.addEventListener("submit", handleNewPostSubmit);

// ForEach loop for the cards method
initialCards.forEach(function (item) {
  console.log(item.name);
  console.log(item.link);
});
