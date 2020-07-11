const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'luciano.sejudo@gmail.com',
    subject: 'Thanks for joining in!',
    text: `Hello! Welcome to the app, ${name}. Let me know how you get along with the app.`
  })
}

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'luciano.sejudo@gmail.com',
    subject: 'Sorry you have to leave!',
    text: `We're sorry you are leaving ${name}, Can you help us to improve?`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
}