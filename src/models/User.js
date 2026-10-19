const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true, //Darf beim speichern nicht fehlen
        unique: true, //Erstellt einen eindeutigen Index in MongoFB um Duplikate zu verhindern
        trim: true, //Entfernt automatisch führende und nachstehende Leerzeichen
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, //Wandelt eingaben automatisch in Kleinbuchstaben um
        trim: true,
        match: [/.+\@.+\..+/, 'Bitte geben Sie eine gültige E-Mail-Adresse ein.'] //Regulärer Ausdruck zur Validierung der E-Mail-Adresse
    },
    password: {
        type: String,
        required: true,
        minlength: 10
    },
    
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);