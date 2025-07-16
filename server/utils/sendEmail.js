const nodemailer = require('nodemailer')
require('dotenv').config()

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_APP_PASS
      }
    })

    const mailOptions = {
      from: `noreply <${process.env.SENDER_EMAIL}>`,
      to,
      subject,
      text
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:', info.response)
  } catch (error) {
    console.error('Error sending email:', error)
  }
}

module.exports = sendEmail
