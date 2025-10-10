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
    console.error('Error sending newsletter', err.message)
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

// emailService.js
// const { Resend } = require('resend');
// require('dotenv').config();

// // Initialize Resend with your API key
// const resend = new Resend(process.env.RESEND_API_KEY);

// // Send OTP / normal email
// const sendEmail = async (to, subject, html) => {
//   try {
//     const { data, error } = await resend.emails.send({
//       from: process.env.SENDER_EMAIL,
//       to,
//       subject,
//       html,
//     });

//     if (error) {
//       throw new Error(error.message);
//     }

//     console.log('Email sent successfully:', data);
//   } catch (error) {
//     console.error('Error sending email:', error.message);
//   }
// };

// // Send newsletter with BCC
// const sendNewsletter = async ({ bcc, subject, html }) => {
//   try {
//     const { data, error } = await resend.emails.send({
//       from: process.env.SENDER_EMAIL,
//       bcc,
//       subject,
//       html,
//     });

//     if (error) {
//       throw new Error(error.message);
//     }

//     console.log('Newsletter sent successfully:', data);
//   } catch (error) {
//     console.error('Error sending newsletter:', error.message);
//   }
// };

// // Send email with attachments
// const sendEmailWithAttachment = async (to, subject, html, attachments = []) => {
//   try {
//     const { data, error } = await resend.emails.send({
//       from: process.env.SENDER_EMAIL,
//       to,
//       subject,
//       html,
//       attachments,
//     });

//     if (error) {
//       throw new Error(error.message);
//     }

//     console.log('Email with attachment sent successfully:', data);
//   } catch (error) {
//     console.error('Error sending email with attachment:', error.message);
//   }
// };

// module.exports = { sendEmail, sendNewsletter, sendEmailWithAttachment };
