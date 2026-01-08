// ============================================
// VALIDATION CONFIGURATION
// ============================================

export const validationConfig = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-button",
  inactiveButtonClass: "modal__submit-button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

// ============================================
// VALIDATION FUNCTIONS
// ============================================

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
  const errorElement = form.querySelector(`#${input.id}-error`);
  input.classList.add(config.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
};

// Hide input error
const hideInputError = (input, form, config) => {
  const errorElement = form.querySelector(`#${input.id}-error`);
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

// Creating event listeners for inputs
const setEventListeners = (form, config) => {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const submitButton = form.querySelector(config.submitButtonSelector);

  // Set initial button state
  toggleButtonState(inputs, submitButton, config);

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      checkInputValidity(input, form, config);
      toggleButtonState(inputs, submitButton, config);
    });
  });
};

// Enable validation with matching form selector
export const enableValidation = (config) => {
  const forms = Array.from(document.querySelectorAll(config.formSelector));
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
    });
    setEventListeners(form, config);
  });
};

// ============================================
// PUBLIC API - Exposed to other scripts
// ============================================

// Reset form validation state
const resetFormValidation = (form, config) => {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const submitButton = form.querySelector(config.submitButtonSelector);

  inputs.forEach((input) => {
    hideInputError(input, form, config);
  });

  // Disable button by default when resetting
  submitButton.classList.add(config.inactiveButtonClass);
  submitButton.disabled = true;
};

// Revalidate form (useful when prepopulating fields)
const revalidateForm = (form, config) => {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const submitButton = form.querySelector(config.submitButtonSelector);

  inputs.forEach((input) => {
    checkInputValidity(input, form, config);
  });

  toggleButtonState(inputs, submitButton, config);
};

// ============================================
// EXPOSE TO GLOBAL SCOPE
// ============================================

window.validationConfig = validationConfig;
window.resetFormValidation = resetFormValidation;
window.revalidateForm = revalidateForm;

// ============================================
// INITIALIZE VALIDATION
// ============================================
