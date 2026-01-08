import { enableValidation, validationConfig } from "../scripts/validation.js";

// ============================================
// CONSTANTS & SELECTORS
// ============================================

const config = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-button",
  closeButtonSelector: ".modal__close-button",
  cardSelector: ".card",
  cardTemplateSelector: "#card-template",
  cardListSelector: ".cards__list",
  cardImageSelector: ".card__image",
  cardTitleSelector: ".card__title",
  cardLikeButtonSelector: ".card__like-btn",
  cardLikeButtonActiveClass: "card__like-btn_active",
  cardDeleteButtonSelector: ".card__delete-btn",
  setTimeoutDelay: 250,
};

const selectors = {
  editProfileModal: "#edit-profile-modal",
  editProfileButton: ".profile__edit-btn",
  editProfileNameInput: "#profile-name-input",
  editProfileDescriptionInput: "#profile-description-input",
  profileName: ".profile__name",
  profileDescription: ".profile__description",

  newPostModal: "#newPost-modal",
  newPostButton: ".profile__add-btn",
  newPostImageInput: "#card-image-input",
  newPostTitleInput: "#card-title-input",

  previewModal: "#preview-modal",
  previewImage: ".modal__image",
  previewCaption: ".modal__caption",
};

// Initial card data
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

// ============================================
// DOM ELEMENTS
// ============================================

// Profile elements
const profileName = document.querySelector(selectors.profileName);
const profileDescription = document.querySelector(selectors.profileDescription);

// Edit Profile Modal
const editProfileModal = document.querySelector(selectors.editProfileModal);
const editProfileButton = document.querySelector(selectors.editProfileButton);
const editProfileForm = editProfileModal.querySelector(config.formSelector);
const editProfileNameInput = editProfileModal.querySelector(
  selectors.editProfileNameInput
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  selectors.editProfileDescriptionInput
);

// New Post Modal
const newPostModal = document.querySelector(selectors.newPostModal);
const newPostButton = document.querySelector(selectors.newPostButton);
const newPostForm = newPostModal.querySelector(config.formSelector);
const newPostImageInput = newPostModal.querySelector(
  selectors.newPostImageInput
);
const newPostTitleInput = newPostModal.querySelector(
  selectors.newPostTitleInput
);

// Preview Modal
const previewModal = document.querySelector(selectors.previewModal);
const previewImage = previewModal.querySelector(selectors.previewImage);
const previewCaption = previewModal.querySelector(selectors.previewCaption);

// Card elements
const cardList = document.querySelector(config.cardListSelector);
const cardTemplate = document
  .querySelector(config.cardTemplateSelector)
  .content.querySelector(config.cardSelector);

// ============================================
// MODAL FUNCTIONS
// ============================================
// Created as an IIFE to modalize the modal functions and avoid polluting global scope
(function () {
  function handleEscapeKey(evt) {
    if (evt.key === "Escape") {
      const openModal = document.querySelector(".modal_is-opened");
      if (openModal) {
        closeModal(openModal);
      }
    }
  }

  function openModal(modal) {
    // Setup ESC key listener (Local to opening modal)
    document.addEventListener("keydown", handleEscapeKey);
    modal.classList.add("modal_is-opened");
  }

  function closeModal(modal) {
    modal.classList.add("modal_is-closing");

    setTimeout(() => {
      modal.classList.remove("modal_is-opened");
      modal.classList.remove("modal_is-closing");
    }, config.setTimeoutDelay);
  }

  function setupModalListeners(modal, openButton) {
    const closeButton = modal.querySelector(config.closeButtonSelector);

    // Open modal (only if openButton exists)
    if (openButton) {
      openButton.addEventListener("click", () => {
        openModal(modal);
      });
    }

    // Close via close button
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        closeModal(modal);
      });
    }

    // Close when clicking outside (on overlay)
    modal.addEventListener("mousedown", (evt) => {
      if (evt.target === modal) {
        closeModal(modal);
      }
    });
  }
})();
// ============================================
// CARD FUNCTIONS
// ============================================
// Created as an IIFE to modalize the modal functions and avoid polluting global scope
(function () {
  function getCardElement(cardData) {
    const cardElement = cardTemplate.cloneNode(true);

    const cardImage = cardElement.querySelector(config.cardImageSelector);
    const cardTitle = cardElement.querySelector(config.cardTitleSelector);

    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;

    return cardElement;
  }

  function renderCard(cardData, method = "append") {
    const cardElement = getCardElement(cardData);
    if (method === "prepend") {
      cardList.prepend(cardElement);
    } else {
      cardList.append(cardElement);
    }
  }

  function handleCardClick(evt) {
    const target = evt.target;

    // Handle like button
    if (target.classList.contains("card__like-btn")) {
      target.classList.toggle("card__like-btn_active");
      return;
    }

    // Handle delete button
    if (target.classList.contains("card__delete-btn")) {
      const card = target.closest(".card");
      card.remove();
      return;
    }

    // Handle image preview
    if (target.classList.contains("card__image")) {
      const card = target.closest(".card");
      const title = card.querySelector(".card__title").textContent;
      openPreviewModal(target.src, title);
    }
  }
})();
// ============================================
// PREVIEW MODAL FUNCTIONS
// ============================================
// Created as an IIFE to modalize the modal functions and avoid polluting global scope
(function () {
  function openPreviewModal(imageSrc, title) {
    previewImage.src = imageSrc;
    previewImage.alt = title;
    previewCaption.textContent = title;
    openModal(previewModal);
  }

  // ============================================
  // FORM HANDLERS
  // ============================================

  function handleEditProfileSubmit(evt) {
    evt.preventDefault();

    profileName.textContent = editProfileNameInput.value;
    profileDescription.textContent = editProfileDescriptionInput.value;

    closeModal(editProfileModal);
  }

  function handleNewPostSubmit(evt) {
    evt.preventDefault();

    const cardData = {
      name: newPostTitleInput.value,
      link: newPostImageInput.value,
    };

    renderCard(cardData, "prepend");

    // Reset form and disable submit button
    evt.target.reset();
    const submitButton = evt.target.querySelector(config.submitButtonSelector);
    submitButton.classList.add("modal__submit-button_disabled");
    submitButton.disabled = true;

    closeModal(newPostModal);
  }
})();
// ============================================
// MODAL PREPARATION FUNCTIONS
// ============================================
// Created as an IIFE to modalize the modal functions and avoid polluting global scope
(function () {
  function prepareEditProfileModal() {
    // Populate fields with current values
    editProfileNameInput.value = profileName.textContent;
    editProfileDescriptionInput.value = profileDescription.textContent;

    // Reset validation state and revalidate (since fields are pre-filled)
    window.resetFormValidation(editProfileForm, window.validationConfig);
    window.revalidateForm(editProfileForm, window.validationConfig);
  }

  function prepareNewPostModal() {
    // Reset validation state for clean form
    window.revalidateForm(newPostForm, window.validationConfig);
  }
})();
// ============================================
// INITIALIZATION
// ============================================

function init() {
  // Render initial cards
  initialCards.forEach((cardData) => {
    renderCard(cardData);
  });

  // Setup card event delegation
  cardList.addEventListener("click", handleCardClick);

  // Setup Edit Profile Modal
  setupModalListeners(editProfileModal, editProfileButton);
  editProfileButton.addEventListener("click", prepareEditProfileModal);
  editProfileForm.addEventListener("submit", handleEditProfileSubmit);

  // Setup New Post Modal
  setupModalListeners(newPostModal, newPostButton);
  newPostButton.addEventListener("click", prepareNewPostModal);
  newPostForm.addEventListener("submit", handleNewPostSubmit);

  // Setup Preview Modal
  setupModalListeners(previewModal, null);
}

enableValidation(validationConfig);

// Start the application
init();
