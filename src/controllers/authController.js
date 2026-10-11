const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');


const register = async (req, res) => {
    
    try {
    const { username, email, password } = reg.body;

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: "Bitte alle Felder ausfüllen!" });
    }

    const existingUser = await User.findOne({ username: req.body.username, email: req.body.email });

    if (existingUser) {
        return res.status(400 || 409).json({ success: false, message: "Benutzer oder Email exestieren bereits!" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    });

    await user.create();
    res.status(201).json({ success: true, message: "Benutzer erfolgreich erstellt!" });

    } catch (error) {
        console.error("Fehler beim Erstellen des Benutzers:", error);
        res.status(500).json({ success: false, message: "Interner Serverfehler" });
    }
}

const login = async (req, res) => {

    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            return res.status(401).json({ success: false, message: "Ungültige Anmeldedaten!" });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Ungültige Anmeldedaten!" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "2h" });
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite : 'strict', maxAge: 2 * 60 * 60 * 1000 }); // Token in Cookie speichern, 2 Stunden gültig
        res.status(200).json({ success: true, message: "Erfolgreich angemeldet!", token });

    }catch (error) {
        console.error("Fehler beim Anmelden des Benutzers:", error);
        res.status(500).json({ success: false, message: "Interner Serverfehler" });
    }
}

module.exports = { register, login }