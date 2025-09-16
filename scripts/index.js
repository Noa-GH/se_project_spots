// Getting Els for Edit Button

const editModalButton = document.querySelector(".profile__edit-btn");
const editModal = document.querySelector("#edit-profile-modal");
const editModalCloseButton = editModal.querySelector(".modal__close-button");

editModalButton.addEventListener("click", function () {
  editModal.classList.add("modal_is-opened");
});

editModalCloseButton.addEventListener("click", function () {
  editModal.classList.remove("modal_is-opened");
});

// Getting Els for New Post Button

const addModalButton = document.querySelector(".profile__add-btn");
const addModal = document.querySelector("#newPost-modal");
const addModalCloseButton = addModal.querySelector(".modal__close-button");

addModalButton.addEventListener("click", function () {
  addModal.classList.add("modal_is-opened");
});

addModalCloseButton.addEventListener("click", function () {
  addModal.classList.remove("modal_is-opened");
});
