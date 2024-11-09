import keys from '../config/keys.js'
import { emailTransporter } from '../utils/helpers.js'

export const sendOrderEmail = async (customer, orderId) => {
    const mailOptions = {
        from: keys.emailAddress,
        to: customer.email,
        subject: 'Your Order Has Been Placed',
        html: `<p>Hello ${customer.firstName},</p><p>Thank you for your order! Your order ID is <strong>${orderId}</strong>. We will keep you updated on its status soon.</p>`,
    }

    console.log(mailOptions)

    // await emailTransporter.sendMail(mailOptions)

    await emailTransporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Error occurred:', err)
        } else {
            console.log('Message sent:', info.messageId)
            console.log('Preview URL:', nodemailer.getTestMessageUrl(info))
        }
    })
}
