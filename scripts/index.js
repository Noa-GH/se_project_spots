// Arry for the cards that were hard coded into HTML
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

// Getting elements for Edit Buttons
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

// Getting elements for New Post Modal
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

// Function to create a card element from template
const cardList = document.querySelector(".cards__list");
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

function getCardElement(cardData) {
  const cardElement = cardTemplate.cloneNode(true);
  // Select the image and title elements inside the card template
  const cardTitle = cardElement.querySelector(".card__title");
  cardTitle.textContent = cardData.name;

  const cardImage = cardElement.querySelector(".card__image");
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;

  return cardElement;
}

// ForEach loop for the cards method
initialCards.forEach(function (cardData) {
  const cardElement = getCardElement(cardData);
  cardList.append(cardElement);
});

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

// Setup function for all behavoirs of modals/forms.
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

// New Post submittion handler
function handleNewPostSubmit(e) {
  e.preventDefault();

  // Create a new card and then prepend it to the list
  const inputValues = {
    name: addModalInputCaption.value,
    link: addModalInputImage.value,
  };

  // Debug: check what values you're getting
  console.log("Image URL:", inputValues.link);
  console.log("Caption:", inputValues.name);

  const cardElement = getCardElement(inputValues);
  cardList.prepend(cardElement);

  // Reset form after submission
  addModalForm.reset();
}

// Pre-open function for edit profile modal
function prepareEditProfileModal() {
  editProfileModalInputName.value = editProfileNameEl.textContent;
  editProfileModalInputDescription.value = editProfileDescriptionEl.textContent;
}
