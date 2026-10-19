const signUpForm = document.querySelector('#creatAccount-form form');
const loginForm = document.querySelector('#logIn-form form');

// --- FEHLERMELDUNGEN ---
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

function attachLiveValidation(input, validationFn) {
  input?.addEventListener('input', () => validationFn(input));
}

// --- LIVE VALIDIERUNG ANBINDEN ---
if (signUpForm) {
  const usernameInput = signUpForm.querySelector('#signup-username');
  const emailInput = signUpForm.querySelector('#signup-email');
  const passwordInput = signUpForm.querySelector('#signup-password');

  attachLiveValidation(usernameInput, validateUsername);
  attachLiveValidation(emailInput, validateEmail);
  attachLiveValidation(passwordInput, (el) => validatePassword(el, true));
}

if (loginForm) {
  const usernameInput = loginForm.querySelector('#login-username');
  const passwordInput = loginForm.querySelector('#login-password');

  attachLiveValidation(usernameInput, validateUsername);
  attachLiveValidation(passwordInput, (el) => validatePassword(el, false));
}

// --- REGISTRIERUNG (SignUp) ---
signUpForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const usernameInput = signUpForm.querySelector('#signup-username');
  const emailInput = signUpForm.querySelector('#signup-email');
  const passwordInput = signUpForm.querySelector('#signup-password');

  const isUsernameValid = validateUsername(usernameInput);
  const isEmailValid = validateEmail(emailInput);
  const isPasswordValid = validatePassword(passwordInput, true);

  if (isUsernameValid && isEmailValid && isPasswordValid) {
    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: usernameInput.value, 
          email: emailInput.value, 
          password: passwordInput.value 
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        window.location.href = '/dashboard.html';
      } else {
        alert(data.message || 'Registrierung fehlgeschlagen');
      }
    } catch (error) {
      alert('Fehler bei der Verbindung zum Server.');
    }
  }
});

// --- LOGIN (SignIn) ---
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
    
  const usernameInput = loginForm.querySelector('#login-username');
  const passwordInput = loginForm.querySelector('#login-password');

  const isUsernameValid = validateUsername(usernameInput);
  const isPasswordValid = validatePassword(passwordInput, false); // false beim Login!

  if (isUsernameValid && isPasswordValid) {
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: usernameInput.value, 
          password: passwordInput.value 
        })
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = '/dashboard.html';
      } else {
        alert(data.message || 'Login fehlgeschlagen');
      }
    } catch (error) {
      alert('Fehler bei der Verbindung zum Server.');
    }
  }
});

// --- LOGOUT ---
document.querySelector('#logout-btn')?.addEventListener('click', async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:3000/api/logout', {
      method: 'POST', 
      credentials: 'include',
    });
    
    if (response.ok) {
      window.location.href = '/index.html';
    }
  } catch (error) {
    alert('Fehler bei Verbindung zum Server.');
  }
});