require('dotenv').config(); //1. Umgebungsvariablen als ALLERERSTES laden

const app = require('./src/app'); // 2. Konfigurierte Express-App aus src/app.js laden
const connectDB = require('./src/config/db'); // 3. Datenbank-Funktion laden

const PORT = process.env.PORT || 3000;

//4. Datenbank verbinden und danach Server starten
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log('Server läuft erfolgreich auf http://localhost:${PORT}');
    });
});