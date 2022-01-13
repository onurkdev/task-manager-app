const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail=(email, name) => {
    sgMail.send({
        to:email,
        from:'onurk.dev@gmail.com',
        subject:'Thanks for joining in!',
        text:`Welcome to Task App ${name}, We hope everthing will be more organized with our Task App`
    })
}

const sendGoodbyeEmail=(email, name) => {
    sgMail.send({
        to:email,
        from:'onurk.dev@gmail.com',
        subject:'Sad to see you go',
        text:`Hi ${name}, \nIts sad to see you go hope you will back soon.\nTask App Team`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
}