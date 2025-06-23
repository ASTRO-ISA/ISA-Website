const nodemailer = require('nodemailer')
require('dotenv').config()

const sendEmail = (to, subject, text) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_APP_PASS,
        },
    })

    transporter.sendMail({
        from: `noreply ${process.env.USER_EMAIL}`,
        to,
        subject,
        text,
    })
}

module.exports = sendEmail