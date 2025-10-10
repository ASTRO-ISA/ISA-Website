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

    await transporter.sendMail(mailOptions)
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

    await transporter.sendMail(mailOptions)
  } catch (err) {
    console.log('Error sending newsletter')
  }
}

const sendEmailWithAttachment = async (to, subject, html, attachments = []) => {
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
      html,
      attachments // will include attachments if provided
    }

    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Error sending email:', error)
  }
}

module.exports = {sendEmail, sendNewsletter, sendEmailWithAttachment}
