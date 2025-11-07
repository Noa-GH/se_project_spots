const validationConfig = {
  formSelector: ".modal__form", // Finds all forms to validate
  inputSelector: ".modal__input", // Finds all inputs in each form
  submitButtonSelector: ".modal__submit-button", // Finds submit buttons
  inactiveButtonClass: "modal__submit-button_disabled", // Disables buttons
  inputErrorClass: "modal__input_type_error", // Styles invalid inputs
  errorClass: "modal__error_visible", // Shows error messages
};

enableValidation(validationConfig);

// Enable validation with matching form selector
const enableValidation = (config) => {
  const forms = Array.from(document.querySelectorAll(config.formSelector));
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
    });
    setEventListeners(form, config);
  });
};


// Creating eventlisteners for inputs
const setEventListeners = (form, config) => {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  inputs.forEach((input) => {
    input.addEventListener("input", (e)) => {
      e.preventDefault();
    };
  });
};

// Card form reset
const cardForm = document.querySelector(".modal__form_type_card");
cardForm.addEventListener("reset", () => {
  const submitButton = cardForm.querySelector(
    validationConfig.submitButtonSelector
  );
  submitButton.classList.add(validationConfig.inactiveButtonClass);
  submitButton.disabled = true;
});

// Profile form reset 
const profileForm = document.querySelector(".modal__form_type_profile");
profileForm.addEventListener("reset", () => {
  const submitButton = profileForm.querySelector(
    validationConfig.submitButtonSelector
  );
  submitButton.classList.add(validationConfig.inactiveButtonClass);
  submitButton.disabled = true;
});

// Edit form reset
const editForm = document.querySelector(".modal__form_type_edit");
editForm.addEventListener("reset", () => {
  const submitButton = editForm.querySelector(
    validationConfig.submitButtonSelector
  );
  submitButton.classList.add(validationConfig.inactiveButtonClass);
  submitButton.disabled = true;
});

checkInputValidity(input, form, config);
  toggleButtonState(inputs, submitButton, config);
};

// Check input validity
const checkInputValidity = (input, form, config) => {
  if (!input.validity.valid) {
    showInputError(input, form, input.validationMessage, config);
  } else {
    hideInputError(input, form, config);
  }
};

// Show input error
const showInputError = (input, form, errorMessage, config) => {
  const errorElement = form.querySelector(`.${input.id}-error`);
  input.classList.add(config.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
};

// Hide input error
const hideInputError = (input, form, config) => {
  const errorElement = form.querySelector(`.${input.id}-error`);
  input.classList.remove(config.inputErrorClass);
  errorElement.classList.remove(config.errorClass);
  errorElement.textContent = "";
};

// Toggle button state
const toggleButtonState = (inputs, button, config) => {
  const hasInvalidInput = inputs.some((input) => !input.validity.valid);
  if (hasInvalidInput) {
    button.classList.add(config.inactiveButtonClass);
    button.disabled = true;
  } else {
    button.classList.remove(config.inactiveButtonClass);
    button.disabled = false;
  }
};