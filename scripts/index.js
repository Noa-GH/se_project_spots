// selecting modal elements for functions
const modalFormBox = document.querySelector("modal");
const openModalFormBox = document.querySelector("modal__is-opened");
const closeModalFormBox = document.querySelector("modal__close-button");
const modalContactForm = document.querySelector("modal__form");

// The opening function of the modal form
function openModalForm() {
  modalOverlay.classList.add("show");
  document.body.style.overflow = "hidden";
  // This will prevent background scrolling when opened
}

// The closing function for the modal form
function closeModalForm() {
  modalOverlay.classList.remove("show");
  document.body.style.overflow = "auto";
  // This will restore background scrolling once closed
}
// Event listeners that look for 'click' function
openModalBtn.addEventListener("click", openModalForm);
closeModalBtn.addEventListener("click", closeModalForm);
