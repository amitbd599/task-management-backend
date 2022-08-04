const nodemailer = require("nodemailer");

const SendEmailUtility = async (EmailTo, EmailText, EmailSubject) => {
  let transporter = nodemailer.createTransport({
    host: "mail.amitjs.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let mailOption = {
    from: "Task Manager <admin@amitjs.com>",
    to: EmailTo,
    subject: EmailSubject,
    text: EmailText,
  };

  return await transporter.sendMail(mailOption);
};

module.exports = SendEmailUtility;
