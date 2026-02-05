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
import Api from "../utils/Api.js";
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
let currentUserId = null;
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
  modal.classList.remove("modal_is-opened", "modal_is-closing");
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
function handleLikeClick(cardId, isLiked) {
  api
    .addLike(cardId, isLiked)
    .then((updatedCard) => {
      console.log("Updated card:", updatedCard);
      console.log("Updated card likes:", updatedCard.likes);
      const cardElement = document.querySelector(`[data-id="${cardId}"]`);
      const likeButton = cardElement.querySelector(".card__like-btn");
      if (updatedCard.isLiked) {
        console.log("Like button should be active");
        likeButton.classList.add("card__like-btn_active");
      } else {
        console.log("Like button should be inactive");
        likeButton.classList.remove("card__like-btn_active");
      }
    })
    .catch((error) => {
      console.error("Error adding like:", error);
    });
}

function getCardElement(cardData) {
  const cardTemplate = document
    .querySelector(config.cardTemplateSelector)
    .content.querySelector(config.cardSelector);
  const cardElement = cardTemplate.cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-btn");

  if (cardData.isLiked) {
    likeButton.classList.add("card__like-btn_active");
  }

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
    const cardElement = target.closest(".card");
    const cardId = cardElement.dataset.id;
    const isLiked = target.classList.contains("card__like-btn_active");
    handleLikeClick(cardId, isLiked);
    return;
  }

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
function handleSubmit(request, evt, loadingText = "Saving...") {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const initialText = submitButton.textContent;
  submitButton.textContent = loadingText;
  submitButton.disabled = true;

  request()
    .then(() => {
      evt.target.reset();
    })
    .catch(console.error)
    .finally(() => {
      submitButton.textContent = initialText;
      submitButton.disabled = false;
    });
}

function handleEditProfileSubmit(evt) {
  function makeRequest() {
    const nameInput = document.querySelector("#profile-name-input");
    const descInput = document.querySelector("#profile-description-input");
    const avatarInput = document.querySelector("#avatar-image-input");

    return api
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
      });
  }
  handleSubmit(makeRequest, evt);
}

function handleNewPostSubmit(evt) {
  function makeRequest() {
    const titleInput = document.querySelector("#card-title-input");
    const imageInput = document.querySelector("#card-image-input");

    const cardData = {
      name: titleInput.value,
      link: imageInput.value,
    };

    return api.createCard(cardData).then((newCard) => {
      renderCard(newCard, "prepend");
      closeModal(document.querySelector("#newPost-modal"));
    });
  }
  handleSubmit(makeRequest, evt);
}

function handleEditAvatarSubmit(evt) {
  function makeRequest() {
    const avatarInput = document.querySelector("#avatar-image-input");
    return api.editUserAvatar(avatarInput.value).then((data) => {
      const avatarImg = document.querySelector(".profile__avatar");
      avatarImg.src = data.avatar;
      closeModal(document.querySelector("#avatar-modal"));
    });
  }
  handleSubmit(makeRequest, evt);
}

function handleDeleteConfirmationSubmit(evt) {
  function makeRequest() {
    return api.deleteCard(cardIdToDelete).then(() => {
      cardToDelete.remove();
      cardToDelete = null;
      cardIdToDelete = null;
      closeModal(document.querySelector("#image-delete-modal"));
    });
  }
  handleSubmit(makeRequest, evt, "Deleting...");
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
      currentUserId = userData._id;
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
