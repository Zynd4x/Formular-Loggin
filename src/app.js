const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const authRoutes = require('./routes/authRoutes');

const app = express();

//1. Middlewares
app.use(cores({
    origin: 'http://localhost:3000', //Frontend-URL
    credentials: true // Erlaubt das Senden von Cookies über CORS
}));

app.use(express.json()); // Parst JSON-Anfragen im Request-Body
app.use(cookieParser()); // Parst Cookies in req.cookies

//2. Statische Frontend-Dateien bereitstellen (public-Ordner)
app.use(express.static(path.join(__dirname, '../public')));

//3. API-Routen einbinden
app.use('/api', authRoutes);

module.exports = app;