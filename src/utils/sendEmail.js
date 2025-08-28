const nodemailer = require("nodemailer");
require('dotenv').config();

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // you can use smtp config also
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Support" <${process.env.SMTP_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
