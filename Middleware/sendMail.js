const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '7001om18@gmail.com',
        pass: 'gcxi muoo tmom cdyr',
    },
});

function sendWelcomeEmail(email, url) {
    const mailOptions = {
        from: '7001om18@gmail.com',
        to: email,
        subject: 'Welcome to Your App',
        text: `http://localhost:5173/${url}`,
    };

    return transporter.sendMail(mailOptions);
}

function updateInfoMail(email, info) {
    const text = info
    const mailOptions = {
        from: '7001om18@gmail.com',
        to: email,
        subject: 'Update Your Information By Admin ',
        text,
    };

    return transporter.sendMail(mailOptions);
}

module.exports = { sendWelcomeEmail, updateInfoMail };