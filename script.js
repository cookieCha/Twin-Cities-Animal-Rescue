const REQUIRED_FIELDS = ["name", "email", "interest", "message"];


function validateName(value) {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return { valid: false, message: "Please enter your name." };
  }
  if (!/^[A-Za-z\s]+$/.test(trimmed)) {
    return { valid: false, message: "Name can only contain letters and spaces." };
  }
  return { valid: true, message: "" };
}

function validateEmail(value) {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return { valid: false, message: "Please enter your email address." };
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(trimmed)) {
    return { valid: false, message: "Please enter a valid email address, like name@example.com." };
  }
  return { valid: true, message: "" };
}

function validateInterest(value) {
  if (value === "") {
    return { valid: false, message: "Please choose what you're interested in." };
  }
  return { valid: true, message: "" };
}

function validateMessage(value) {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return { valid: false, message: "Please add a short message so we know how to help." };
  }
  if (trimmed.length < 10) {
    return { valid: false, message: "Please add a little more detail (at least 10 characters)." };
  }
  return { valid: true, message: "" };
}


function getValidator(fieldName) {
  if (fieldName === "name") return validateName;
  if (fieldName === "email") return validateEmail;
  if (fieldName === "interest") return validateInterest;
  if (fieldName === "message") return validateMessage;
}


function showFieldError(fieldName, message) {
  const errorEl = document.getElementById(`${fieldName}Error`);
  const inputEl = document.getElementById(fieldName);
  if (!errorEl || !inputEl) return;

  errorEl.textContent = message;
  inputEl.setAttribute("aria-invalid", "true");
}

function clearFieldError(fieldName) {
  const errorEl = document.getElementById(`${fieldName}Error`);
  const inputEl = document.getElementById(fieldName);
  if (!errorEl || !inputEl) return;

  errorEl.textContent = "";
  inputEl.removeAttribute("aria-invalid");
}



function saveContactInfo() {
  const contactInfo = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim()
  };
  localStorage.setItem("tcar_contact_info", JSON.stringify(contactInfo));
}

function clearContactInfo() {
  localStorage.removeItem("tcar_contact_info");
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";

  const noteEl = document.getElementById("prefillNote");
  if (noteEl) {
    noteEl.textContent = "";
    noteEl.hidden = true;
  }
}

function prefillReturningVisitor() {
  const saved = localStorage.getItem("tcar_contact_info");
  if (!saved) return;

  const contactInfo = JSON.parse(saved);
  document.getElementById("name").value = contactInfo.name;
  document.getElementById("email").value = contactInfo.email;

  const noteEl = document.getElementById("prefillNote");
  if (noteEl) {
    noteEl.textContent = `Welcome back, ${contactInfo.name}! We've filled in your name and email from your last visit. `;

    const clearLink = document.createElement("button");
    clearLink.type = "button";
    clearLink.className = "clear-info-link";
    clearLink.textContent = "Not you? Clear saved info.";
    clearLink.addEventListener("click", clearContactInfo);

    noteEl.appendChild(clearLink);
    noteEl.hidden = false;
  }
}


function handleContactSubmit(event) {
  event.preventDefault();

  const form = event.target;
  let firstInvalidField = null;

  REQUIRED_FIELDS.forEach(fieldName => {
    const inputEl = document.getElementById(fieldName);
    const validate = getValidator(fieldName);
    const result = validate(inputEl.value);

    if (result.valid) {
      clearFieldError(fieldName);
    } else {
      showFieldError(fieldName, result.message);
      if (!firstInvalidField) firstInvalidField = inputEl;
    }
  });

  const successEl = document.getElementById("formSuccess");

  if (firstInvalidField) {
    if (successEl) successEl.hidden = true;
    firstInvalidField.focus();
    return; 
  }

  saveContactInfo();

  if (successEl) {
    successEl.textContent = "Thanks! Your interest form has been submitted. Our team will follow up with you soon.";
    successEl.hidden = false;
  }

  form.reset();
}

function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return; 

  prefillReturningVisitor();
  contactForm.addEventListener("submit", handleContactSubmit);

  REQUIRED_FIELDS.forEach(fieldName => {
    const inputEl = document.getElementById(fieldName);
    if (inputEl) {
      inputEl.addEventListener("input", () => clearFieldError(fieldName));
    }
  });
}

document.addEventListener("DOMContentLoaded", initContactForm);