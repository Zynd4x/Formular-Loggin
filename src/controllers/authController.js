const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const register = async (req, res) => {
    
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "Bitte alle Felder ausfüllen!" });
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }]  });
        
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Benutzer oder Email exestieren bereits!" });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
    
        await user.save();
        res.status(201).json({ success: true, message: "Benutzer erfolgreich erstellt!" });

    } catch (error) {
        console.error("Fehler beim Erstellen des Benutzers:", error);
        res.status(500).json({ success: false, message: "Interner Serverfehler" });
    }
}

const login = async (req, res) => {

    try {
        const { username, password, rememberMe } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Bitte alle Felder ausfüllen!" });
        }
        
        
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ success: false, message: "Ungüldige Anmeldedaten!" });
        }

        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Ungültige Anmeldedaten!" });
        }

        const cookieMaxAge = rememberMe
            ? 30 * 24 * 60 * 60 * 1000 
            : 2 * 60 * 60 * 1000;

        const jwtExpiry = rememberMe ? '30d' : '2h';

        const token = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: jwtExpiry }
        );

        res.cookie('token', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite : 'strict', 
            maxAge: cookieMaxAge 
        }); 

        res.status(200).json({ success: true, message: "Erfolgreich angemeldet!", token });

    }catch (error) {
        console.error("Fehler beim Anmelden des Benutzers:", error);
        res.status(500).json({ success: false, message: "Interner Serverfehler" });
    }
};

/*
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_USER,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
*/

// Hilfsfunktion zum Erstellen des Ethereal-Transporters
async function createEthrealTransporter() {
  // 1. Automatisch ein temporäres Test-Konto generieren
  const testAccount = await nodemailer.createTestAccount();

  // 2. Transporter mit den generierten Zugangsdaten erstellen
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true für Port 465, false für andere Ports
    auth: {
      user: testAccount.user, // Automatisch von Ethereal erzeugt
      pass: testAccount.pass  // Automatisch von Ethereal erzeugt
    }
  });

  return { transporter, testAccount };
}

//Reset-Link anfordern
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        //Aus Sicherheitsgründen auch bei unbekannter Email keinen Fehler verraten
        if (!user) {
            return res.status(200).json({
                success: true,
                message: 'Falls ein Konto exestiert, wurde eine Email gesendet'
            });
        }

        // Ungehashten Token für die E-Mail erzeugen
        const resetToken = crypto.randomBytes(32).toString('hex');

        //Gehashten Token in der DB speichern (Schutz vor DB-Leaks)
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        //Token ist 1std gültig 
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        //Reset-URL erstellen
        const resetUrl = `http://localhost:3000/reset-password.html?token=${resetToken}`;
        const { transporter } = await createEthrealTransporter();
        const mailOptions = {
            form: '"Dein App Name" <no-reply@deinedomain.com',
            to: user.email,
            subject: 'Passwort zurücksetzten',
            html: `
                <h3>Passwort zurücksetzten</h3>
                <p>Klicke auf den folgenden Link, um dein Passwort zurückzusetzen. Der Link ist 1 Stunde gültig:</p>
                <a href="${resetUrl}" target="_blank">${resetUrl}</a> 
                `
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Emial gesendet! Vorschau-URL:', nodemailer.getTestMessageUrl(info));
        res.status(200).json({
            success: true,
            message: 'Falls eine Konto exestiert, wurde eine Email gesendet.'
        });
    } catch (error) {
        console.error('Fehler beim Email-Versand:', error);
        res.status(500).json({ success: false, message: 'Interner Serverfehler '});
    }
};

//Neues Passwort speichern
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        //Gesendeten Token hashen, um mit DB zu vergleichen
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        //User anhand des Tokens und der Ablaufzeit suchen
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() } //muss in der Zukunft liegen
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Token ist ungültig oder abgelaufen'
            });
        }

        //Neues Passwort hashen oder speichen
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        //Reset-Felder zurücksetzten 
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Passwort wurde erfolgreich geändert!'
        });
    } catch (error) {
        console.error('Fehler bei Password-Zurücksetzen:', error);
        res.status(500).json({ success: false, message: 'Interner Serverfehler' });
    }
};

module.exports = { register, login, forgotPassword, resetPassword };