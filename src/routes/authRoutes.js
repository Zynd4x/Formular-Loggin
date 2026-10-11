const { register, login } = require('../controllers/authController');
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');


//Öffentliche Route ohne Middleware
router.get('/public', (req, res) => {
    res.json({ message: 'Diese Route ist für jeden öffentlich zugänglich.' });
});

//Geschütze Route (passiert zuerst protect)
router.get('/profile', protect, (req, res) => {
    //zugriff auf req.user, das in der Middleware gesetzt wurde
    res.json({
        message : 'Willkommen im geschützten Bereich!',
        userId: req.user.Id
    });
});

router.post("/register", register);
router.post("/login", login);


module.exports = router;