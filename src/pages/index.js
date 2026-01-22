// Importing CSS
import "./index.css";
// Importing Avatar Image
import avatarImage from "../images/Avatar.svg";
import logoImage from "../images/Logo.svg";
import pencilImage from "../images/pencil.svg";
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
    authorization : "78229750-07b7-4137-b187-46f0022d2a0c",
  } 
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
  if (target.classList.contains("card__delete-btn")) {
    target.closest(".card").remove();
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
  
  const profileName = document.querySelector(".profile__name");
  const profileDescription = document.querySelector(".profile__description");
  const nameInput = document.querySelector("#profile-name-input");
  const descInput = document.querySelector("#profile-description-input");

  profileName.textContent = nameInput.value;
  profileDescription.textContent = descInput.value;

  closeModal(document.querySelector("#edit-profile-modal"));
}

function handleNewPostSubmit(evt) {
  evt.preventDefault();

  const titleInput = document.querySelector("#card-title-input");
  const imageInput = document.querySelector("#card-image-input");

  const cardData = {
    name: titleInput.value,
    link: imageInput.value,
  };

  renderCard(cardData, "prepend");

  evt.target.reset();
  const submitButton = evt.target.querySelector(config.submitButtonSelector);
  submitButton.classList.add("modal__submit-button_disabled");
  submitButton.disabled = true;

  closeModal(document.querySelector("#newPost-modal"));
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
// ============================================
// INITIALIZATION
// ============================================
function init() {
const avatarImg = document.querySelector(".profile__avatar");
  if (avatarImg) {
    avatarImg.src = avatarImage;
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
  api.getAppInfo()
    .then(([cards]) => {
      cards.forEach((cardData) => renderCard(cardData));
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

  // Setup New Post Modal
  const newPostModal = document.querySelector("#newPost-modal");
  const newPostButton = document.querySelector(".profile__add-btn");
  const newPostForm = newPostModal.querySelector(config.formSelector);

  setupModalListeners(newPostModal, newPostButton);
  newPostButton.addEventListener("click", prepareNewPostModal);
  newPostForm.addEventListener("submit", handleNewPostSubmit);

  // Setup Preview Modal
  const previewModal = document.querySelector("#preview-modal");
  setupModalListeners(previewModal, null);
}
// Enable validation
enableValidation(validationConfig);
// Start app
init();