document.addEventListener('DOMContentLoaded', () => {
  const signUpForm = document.querySelector('#creatAccount-form form');
  const loginForm = document.querySelector('#logIn-form form');

  // Fehlermeldung anzeigen
  function showError(input, message) {
    const parent = input.parentElement;
    let error = parent.querySelector('.error-message');
    
    if (!error) {
      error = document.createElement('span');
      error.className = 'error-message';
      parent.appendChild(error);
    }
    
    error.textContent = message;
    input.classList.add('invalid');
  }

  // Fehlermeldung entfernen
  function clearError(input) {
    const parent = input.parentElement;
    const error = parent.querySelector('.error-message');
    if (error) {
      error.remove();
    }
    input.classList.remove('invalid');
  }

  // --- VALIDIERUNGSREGELN ---

  function validateUsername(input) {
    const val = input.value.trim();
    if (!val) {
      showError(input, 'Benutzername ist erforderlich.');
      return false;
    } else if (val.length < 3) {
      showError(input, 'Mindestens 3 Zeichen erforderlich.');
      return false;
    }
    clearError(input);
    return true;
  }

  function validateEmail(input) {
    const val = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) {
      showError(input, 'E-Mail ist erforderlich.');
      return false;
    } else if (!emailRegex.test(val)) {
      showError(input, 'Ungültige E-Mail-Adresse.');
      return false;
    }
    clearError(input);
    return true;
  }

  function validatePassword(input, isSignUp = false) {
    const val = input.value.trim();
    if (!val) {
      showError(input, 'Passwort ist erforderlich.');
      return false;
    }
    if (isSignUp) {
      if (val.length < 10 || val.length > 20) {
        showError(input, 'Passwort muss 10 bis 20 Zeichen lang sein.');
        return false;
      }
    }
    clearError(input);
    return true;
  }

  // --- LIVE VALIDIERUNG ON INPUT ---

  function attachLiveValidation(input, validationFn) {
    input.addEventListener('input', () => validationFn(input));
  }

  // --- FORMULAR 1: SIGN UP ---
  if (signUpForm) {
    const usernameInput = signUpForm.querySelector('#signup-username');
    const emailInput = signUpForm.querySelector('#signup-email');
    const passwordInput = signUpForm.querySelector('#signup-password');

    attachLiveValidation(usernameInput, validateUsername);
    attachLiveValidation(emailInput, validateEmail);
    attachLiveValidation(passwordInput, (el) => validatePassword(el, true));

    signUpForm.addEventListener('submit', (e) => {
      const isUsernameValid = validateUsername(usernameInput);
      const isEmailValid = validateEmail(emailInput);
      const isPasswordValid = validatePassword(passwordInput, true);

      if (!isUsernameValid || !isEmailValid || !isPasswordValid) {
        e.preventDefault(); // Stoppt das Formular-Senden
      }
    });
  }

  // --- FORMULAR 2: LOG IN ---
  if (loginForm) {
    const usernameInput = loginForm.querySelector('#login-username');
    const passwordInput = loginForm.querySelector('#login-password');

    attachLiveValidation(usernameInput, validateUsername);
    attachLiveValidation(passwordInput, (el) => validatePassword(el, false));

    loginForm.addEventListener('submit', (e) => {
      const isUsernameValid = validateUsername(usernameInput);
      const isPasswordValid = validatePassword(passwordInput, false);

      if (!isUsernameValid || !isPasswordValid) {
        e.preventDefault(); // Stoppt das Formular-Senden
      }
    });
  }


});