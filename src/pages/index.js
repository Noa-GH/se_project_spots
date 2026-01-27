// Importing CSS
import "./index.css";
// Importing Avatar Image
import avatarImage from "../images/Avatar.svg";
import logoImage from "../images/Logo.svg";
import pencilImage from "../images/pencil.svg";
import pencilLightImage from "../images/pencil-light.svg";
import plusImage from "../images/Plus.svg";
// Importing validation
import { enableValidation, validationConfig } from "../scripts/validation.js";
// Importing API
import Api from "../unitls/Api.js";
// ============================================
// API CONFIGURATION
// ============================================
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    "Content-Type": "application/json",
    authorization: "78229750-07b7-4137-b187-46f0022d2a0c",
  },
});
// ============================================
// CONSTANTS
// ============================================
const config = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-button",
  closeButtonSelector: ".modal__close-button",
  cardSelector: ".card",
  cardTemplateSelector: "#card-template",
  cardListSelector: ".cards__list",

  setTimeoutDelay: 250,
};

let cardToDelete = null;
let cardIdToDelete = null;
// ============================================
// MODAL FUNCTIONS
// ============================================
function handleEscapeKey(evt) {
  if (evt.key === "Escape") {
    const openModal = document.querySelector(".modal_is-opened");
    if (openModal) {
      closeModal(openModal);
    }
  }
}

function openModal(modal) {
  document.addEventListener("keydown", handleEscapeKey);
  modal.classList.add("modal_is-opened");
}

function closeModal(modal) {
  document.removeEventListener("keydown", handleEscapeKey);
  modal.classList.add("modal_is-closing");
  setTimeout(() => {
    modal.classList.remove("modal_is-opened", "modal_is-closing");
  }, config.setTimeoutDelay);
}

function setupModalListeners(modal, openButton) {
  const closeButton = modal.querySelector(config.closeButtonSelector);

  if (openButton) {
    openButton.addEventListener("click", () => openModal(modal));
  }

  if (closeButton) {
    closeButton.addEventListener("click", () => closeModal(modal));
  }

  modal.addEventListener("mousedown", (evt) => {
    if (evt.target === modal) closeModal(modal);
  });
}
// ============================================
// CARD FUNCTIONS
// ============================================
function getCardElement(cardData) {
  const cardTemplate = document
    .querySelector(config.cardTemplateSelector)
    .content.querySelector(config.cardSelector);
  const cardElement = cardTemplate.cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  cardElement.dataset.id = cardData._id;

  return cardElement;
}

function renderCard(cardData, method = "append") {
  const cardList = document.querySelector(config.cardListSelector);
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
  // Handle delete button
  if (target.classList.contains("card__delete-btn")) {
    cardToDelete = target.closest(".card");
    cardIdToDelete = cardToDelete.dataset.id;
    openModal(document.querySelector("#image-delete-modal"));
    return;
  }

  // Handle image preview
  if (target.classList.contains("card__image")) {
    const card = target.closest(".card");
    const title = card.querySelector(".card__title").textContent;
    openPreviewModal(target.src, title);
  }
}
// ============================================
// PREVIEW MODAL
// ============================================
function openPreviewModal(imageSrc, title) {
  const previewModal = document.querySelector("#preview-modal");
  const previewImage = previewModal.querySelector(".modal__image");
  const previewCaption = previewModal.querySelector(".modal__caption");

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
  const nameInput = document.querySelector("#profile-name-input");
  const descInput = document.querySelector("#profile-description-input");
  const avatarInput = document.querySelector("#avatar-image-input");
  const submitButton = evt.target.querySelector(config.submitButtonSelector);
  const initialButtonText = submitButton.textContent;

  submitButton.textContent = "Saving...";

  api
    .editUserInfo({
      name: nameInput.value,
      about: descInput.value,
      avatar: avatarInput.value,
    })
    .then((data) => {
      const profileName = document.querySelector(".profile__name");
      const profileDescription = document.querySelector(
        ".profile__description",
      );
      const profileAvatar = document.querySelector(".profile__avatar");

      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      profileAvatar.src = data.avatar;

      closeModal(document.querySelector("#edit-profile-modal"));
    })
    .catch(console.error)
    .finally(() => {
      submitButton.textContent = initialButtonText;
    });
}

function handleNewPostSubmit(evt) {
  evt.preventDefault();

  const titleInput = document.querySelector("#card-title-input");
  const imageInput = document.querySelector("#card-image-input");
  const submitButton = evt.target.querySelector(config.submitButtonSelector);
  const initialButtonText = submitButton.textContent;

  const cardData = {
    name: titleInput.value,
    link: imageInput.value,
  };

  submitButton.textContent = "Saving...";
  submitButton.disabled = true;

  api
    .createCard(cardData)
    .then((newCard) => {
      // Render the card with the proper _id from the API
      renderCard(newCard, "prepend");
      evt.target.reset();
      closeModal(document.querySelector("#newPost-modal"));
    })
    .catch((error) => {
      console.error("Error creating card:", error);
      // Re-enable button on error so user can try again
      submitButton.textContent = initialButtonText;
      submitButton.disabled = false;
    })
    .finally(() => {
      // Reset button state after modal closes
      setTimeout(() => {
        submitButton.textContent = initialButtonText;
        submitButton.classList.add("modal__submit-button_disabled");
        submitButton.disabled = true;
      }, config.setTimeoutDelay);
    });
}

function handleEditAvatarSubmit(evt) {
  evt.preventDefault();
  const avatarInput = document.querySelector("#avatar-image-input");
  const submitButton = evt.target.querySelector(config.submitButtonSelector);
  const initialButtonText = submitButton.textContent;

  submitButton.textContent = "Saving...";

  api
    .editUserAvatar(avatarInput.value)
    .then((data) => {
      const avatarImg = document.querySelector(".profile__avatar");
      avatarImg.src = data.avatar;
      closeModal(document.querySelector("#avatar-modal"));
    })
    .catch(console.error)
    .finally(() => {
      submitButton.textContent = initialButtonText;
    });
}

function handleDeleteConfirmationSubmit(evt) {
  evt.preventDefault();
  if (!cardIdToDelete || !cardToDelete) return;

  const submitButton = evt.target.querySelector(config.submitButtonSelector);
  const initialButtonText = submitButton.textContent;
  submitButton.textContent = "Deleting...";
  submitButton.disabled = true;

  api
    .deleteCard(cardIdToDelete)
    .then(() => {
      cardToDelete.remove();
      cardToDelete = null;
      cardIdToDelete = null;

      // Add delay before closing modal
      setTimeout(() => {
        closeModal(document.querySelector("#image-delete-modal"));
      }, 800);

      // Reset button text AFTER modal finishes closing
      setTimeout(() => {
        submitButton.textContent = initialButtonText;
        submitButton.disabled = false;
      }, 1400);
    })
    .catch((error) => {
      console.error(error);
      // Reset button text immediately on error
      submitButton.textContent = initialButtonText;
      submitButton.disabled = false;
    });
}
// ============================================
// MODAL PREPARATION
// ============================================
function prepareEditProfileModal() {
  const modal = document.querySelector("#edit-profile-modal");
  const form = modal.querySelector(config.formSelector);
  const nameInput = document.querySelector("#profile-name-input");
  const descInput = document.querySelector("#profile-description-input");
  const profileName = document.querySelector(".profile__name");
  const profileDescription = document.querySelector(".profile__description");

  nameInput.value = profileName.textContent;
  descInput.value = profileDescription.textContent;

  if (window.resetFormValidation && window.revalidateForm) {
    window.resetFormValidation(form, validationConfig);
    window.revalidateForm(form, validationConfig);
  }
}

function prepareNewPostModal() {
  const modal = document.querySelector("#newPost-modal");
  const form = modal.querySelector(config.formSelector);

  if (window.resetFormValidation) {
    window.resetFormValidation(form, validationConfig);
  }
}

function prepareEditAvatarModal() {
  const modal = document.querySelector("#avatar-modal");
  const form = modal.querySelector(config.formSelector);

  if (window.resetFormValidation) {
    window.resetFormValidation(form, validationConfig);
  }
}
// ============================================
// INITIALIZATION
// ============================================
function init() {
  /* Avatar image is now fetched from API */

  const avatarEditIcon = document.querySelector(".profile__avatar-btn-icon");
  if (avatarEditIcon) {
    avatarEditIcon.src = pencilLightImage;
  }

  const logoImg = document.querySelector(".header__logo");
  if (logoImg) {
    logoImg.src = logoImage;
  }

  const editIcon = document.querySelector(".profile__edit-icon");
  if (editIcon) {
    editIcon.src = pencilImage;
  }

  const addIcon = document.querySelector(".profile__add-icon");
  if (addIcon) {
    addIcon.src = plusImage;
  }

  // Fetch data
  api
    .getAppInfo()
    .then(([cards, userData]) => {
      cards.forEach((cardData) => renderCard(cardData));

      const profileName = document.querySelector(".profile__name");
      const profileDescription = document.querySelector(
        ".profile__description",
      );
      const profileAvatar = document.querySelector(".profile__avatar");

      if (profileName) profileName.textContent = userData.name;
      if (profileDescription) profileDescription.textContent = userData.about;
      if (profileAvatar) {
        profileAvatar.src = userData.avatar;
        profileAvatar.alt = userData.name;
      }
    })
    .catch(console.error);

  // Setup card event delegation
  const cardList = document.querySelector(config.cardListSelector);
  cardList.addEventListener("click", handleCardClick);

  // Setup Edit Profile Modal
  const editProfileModal = document.querySelector("#edit-profile-modal");
  const editProfileButton = document.querySelector(".profile__edit-btn");
  const editProfileForm = editProfileModal.querySelector(config.formSelector);

  setupModalListeners(editProfileModal, editProfileButton);
  editProfileButton.addEventListener("click", prepareEditProfileModal);
  editProfileForm.addEventListener("submit", handleEditProfileSubmit);

  // Setup Edit Avatar Modal
  const editAvatarModal = document.querySelector("#avatar-modal");
  const editAvatarButton = document.querySelector(".profile__avatar-btn");
  const editAvatarForm = editAvatarModal.querySelector(config.formSelector);

  setupModalListeners(editAvatarModal, editAvatarButton);
  editAvatarButton.addEventListener("click", prepareEditAvatarModal);
  editAvatarForm.addEventListener("submit", handleEditAvatarSubmit);

  // Setup New Post Modal
  const newPostModal = document.querySelector("#newPost-modal");
  const newPostButton = document.querySelector(".profile__add-btn");
  const newPostForm = newPostModal.querySelector(config.formSelector);

  setupModalListeners(newPostModal, newPostButton);
  newPostButton.addEventListener("click", prepareNewPostModal);
  newPostForm.addEventListener("submit", handleNewPostSubmit);

  // Setup Delete Confirmation Modal
  const deleteModal = document.querySelector("#image-delete-modal");
  const deleteForm = deleteModal.querySelector(config.formSelector);
  const deleteCancelButton = deleteModal.querySelector(".modal__cancel-button");

  setupModalListeners(deleteModal, null);
  deleteForm.addEventListener("submit", handleDeleteConfirmationSubmit);

  // Add cancel button handler
  if (deleteCancelButton) {
    deleteCancelButton.addEventListener("click", () => {
      cardToDelete = null;
      cardIdToDelete = null;
      closeModal(deleteModal);
    });
  }

  // Setup Preview Modal
  const previewModal = document.querySelector("#preview-modal");
  setupModalListeners(previewModal, null);
}
// Enable validation
enableValidation(validationConfig);
// Start app
init();
