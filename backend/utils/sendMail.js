const nodemailer = require("nodemailer");

const sendMail = async (email, subjectLine, message) => {
  var transport = nodemailer.createTransport({
    sendmail: true,
    newline: "unix",
    path: "/usr/sbin/sendmail", // Path to the sendmail command on your system
  });

  await transport.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: subjectLine,
    text: message,
  });
};

module.exports = sendMail;
