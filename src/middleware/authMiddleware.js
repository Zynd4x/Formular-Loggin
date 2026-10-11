const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {

    //1. Authorization-Header auslesen
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // 2. Token isolieren (trennt "Bearer" vom eigentlichen Token)
    const token = authHeader.split(' ')[1];

    try {
        // 3. Token mit dem geheimen Schlüssel verifizieren
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // 4. Dekodierte Nutzerdaten an das Request-Objekt anhängen
        req.user = decoded;
        // 5. Weiter zur nächsten Middleware oder Route
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    
};

module.exports = protect;