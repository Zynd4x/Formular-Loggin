const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {

    //1. Token direkt aus Cookies auslesen
    const token = req.cookies.token;

    //2. Prüfen, ob das Cookie überhaupt exestiert
    if (!token) {
        return res.status(401).json({ message: 'Zugriff verweigert. Kein Token vorhanden.' });
    }

    try {
        // 3. Token mit dem geheimen Schlüssel verifizieren
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // 4. Dekodierte Nutzerdaten an das Request-Objekt anhängen
        req.user = decoded;
        // 5. Weiter zur nächsten Middleware oder Route
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Ungültiger oder abgelaufener Token!' });
    }
};

module.exports = protect;