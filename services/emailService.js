import keys from '../config/keys.js'
import { emailTransporter } from '../utils/helpers.js'

const sendEmail = async (options) => {
    // Define the email options
    const mailOptions = {
        from: keys.emailAddress,
        to: options.email,
        subject: options.subject,
        html: options.html,
    }

    // Actually send the email
    await emailTransporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(`Error:`, error)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })
}

export default sendEmail
