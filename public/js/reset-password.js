document.addEventListener('DOMContentLoaded', () => {
    const resetForm = document.querySelector('#reset-password-form');
  
    // Token aus den URL-Parametern extrahieren
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const passwordInput = resetForm.querySelector('#new-password');
    const passwordInputVerify = resetForm.querySelector('#new-password-verify');

    if (!token) {
        alert('Ungültiger oder fehlender Reset-Token.');
        window.location.href = '/index.html';
        return;
    }

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

    function validatePasswordLength(input, isSignUp = false) {
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

    function validatePasswordIdent(input) {
        const samePassword = passwordInputVerify.value === passwordInput.value;

        if (!samePassword) {
            showError(input, 'Passwort muss identisch sein!');
            return false
        }
        clearError(input);
        return true
    }

    function attachLiveValidation(input, validationFn) {
        input?.addEventListener('input', () => validationFn(input));
    }
    

    if (resetForm) {
        attachLiveValidation(passwordInput, (el) => validatePasswordLength(el, true));
        attachLiveValidation(passwordInputVerify, (el) => validatePasswordIdent(el, true));
    }

    resetForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPassword = document.querySelector('#new-password-verify').value;

        try {
        const response = await fetch('http://localhost:3000/api/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, newPassword })
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            window.location.href = '/index.html';
        } else {
            alert(data.message || 'Fehler beim Zurücksetzen.');
        }
        } catch (error) {
        alert('Verbindungsfehler zum Server.');
        }
    });
});