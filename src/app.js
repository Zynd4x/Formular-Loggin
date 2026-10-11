// Registrierung (Sign Up)
document.querySelector('#creatAccount-form form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            credentials: 'include', // Damit Cookies gesendet werden
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        alert(data.message);
    } catch (error) {
        alert('Fehler bei der Verbindung zum Server.');
    }
})

//Login (Sign In)
document.querySelector('#logIn-form form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            credentials: 'include', // Damit Cookies gesendet werden
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = '/dashboard.html';
        } else {
            alert(data.message || 'Login Fehlgeschlagen');
        }
    } catch (error) {
        alert('Fehler bei der Verbindung zum Server.');
    }
});

import routes from "./routes/authRoutes.js";

const app = express();
app.use("/api", routes);