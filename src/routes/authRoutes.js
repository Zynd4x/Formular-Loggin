const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');



//Öffentliche Route ohne Middleware
router.post("/register", register);
router.post("/login", login);

router.get('/public', (req, res) => {
    res.json({ message: 'Diese Route ist für jeden öffentlich zugänglich.' });
});

//Geschütze Route (passiert zuerst protect)
router.get('/profile', protect, (req, res) => {
    res.json({
        message: 'Willkommen im geschützten Bereich!',
        userId: req.user.userId // Korrigiert zu userId
    });
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true, message: 'Erfolgreich ausgeloggt' });
});

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;