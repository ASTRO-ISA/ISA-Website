const nodemailer = require('nodemailer')
require('dotenv').config()

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_APP_PASS
      }
    })

    const mailOptions = {
      from: `ISA-India <${process.env.SENDER_EMAIL}>`,
      to,
      subject,
      html
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:', info.response)
  } catch (error) {
    console.error('Error sending email:', error)
  }
}

const sendNewsletter = async ({bcc, subject, html}) => {
  try{
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_APP_PASS
      }
    })

    const mailOptions = {
      from: `noreply <${process.env.SENDER_EMAIL}`,
      bcc,
      subject,
      html
    }

    const newsletter = await transporter.sendMail(mailOptions)
    console.log('Newsletter sent', newsletter.response)
  } catch (err) {
    console.log('Error sending newsletter')
  }
}

module.exports = {sendEmail, sendNewsletter}
