document.addEventListener('DOMContentLoaded', async () => {
    const loadingEl = document.getElementById('loading');
    const profileDataEl = document.getElementById('profile-data');
    const userIdEl = document.getElementById('user-id');
    const errorMsgEl = document.getElementById('error-message');
    const logoutBtn = document.getElementById('logout-btn');

    // 1. Geschützte Profildaten vom Server abrufen
    try {
        const response = await fetch('http://localhost:3000/api/profile', {
            method: 'GET',
            credentials: 'include' // Schickt das HttpOnly-Cookie automatisch mit
        });

        const data = await response.json();

        if (response.ok) {
            // Erfolgreich verifiziert: Daten anzeigen
            userIdEl.textContent = data.userId;
            loadingEl.classList.add('hidden');
            profileDataEl.classList.remove('hidden');
        } else {
            // Nicht autorisiert (z. B. Token abgelaufen oder nicht vorhanden)
            alert('Sitzung abgelaufen oder ungültig. Bitte melden Sie sich erneut an.');
            window.location.href = '/index.html';
        }
    } catch (error) {
        console.error('Fehler beim Laden des Profils:', error);
        loadingEl.classList.add('hidden');
        errorMsgEl.textContent = 'Verbindung zum Server fehlgeschlagen.';
        errorMsgEl.classList.remove('hidden');
    }

    // 2. Logout-Funktionalität
    logoutBtn?.addEventListener('click', async () => {
        try {
            const response = await fetch('http://localhost:3000/api/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                window.location.href = '/index.html';
            } else {
                alert('Fehler beim Abmelden.');
            }
        } catch (error) {
            console.error('Fehler beim Logout:', error);
            alert('Verbindungsfehler beim Abmelden.');
        }
    });
});