import nodemailer from 'nodemailer'
import speakeasy from 'speakeasy'
import twilio from 'twilio'
import crypto from 'crypto'

import catchAsync from '../utils/catchAsync.js'
import OTP from '../models/users/otpModel.js'
import keys from '../config/keys.js'

// keysure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: keys.emailAddress,
        pass: keys.emailPassKey,
    },
})

// keysure Twilio
const client = twilio(keys.twilioAccountSID, keys.twilioAuthToken)

// Generate OTP and its hash
export const generateOTP = () => {
    const token = speakeasy.totp({
        secret: keys.otpSecretKey,
        encoding: 'base32',
    })
    const hash = crypto.createHash('sha256').update(token).digest('hex')
    return { token, hash }
}

// Send OTP via email
export const sendEmail = catchAsync(async (email, otp) => {
    const mailOptions = {
        from: keys.emailAddress,
        to: email,
        subject: 'Your Vistamart OTP Code',
        text: `Dear Customer,\n\nYour OTP code for Vistamart is: **${otp}**. It is valid for 5 minutes.\n\nThank you for choosing Vistamart!\n\nBest Regards,\nVistamart Team`,
    }
    return transporter.sendMail(mailOptions)
})

// Send OTP via SMS
export const sendSMS = catchAsync(async (phone, otp) => {
    return client.messages.create({
        body: `Dear Customer, your OTP code for Vistamart is: ${otp}. It is valid for 5 minutes.`,
        from: keys.twilioPhoneNumber,
        to: phone,
    })
})

// Save OTP to the database
export const saveOTP = catchAsync(async (email, phone, hash) => {
    const otpEntry = new OTP({ email, phone, hash, createdAt: Date.now() })
    await otpEntry.save()
})

// Verify OTP
export const validateOTP = catchAsync(async (token, email) => {
    const otpEntry = await OTP.findOne({ email }).sort({ createdAt: -1 }).exec()
    if (!otpEntry) {
        throw new Error('No OTP found for this email')
    }

    const isExpired = Date.now() - otpEntry.createdAt > 5 * 60 * 1000 // 5 minutes
    if (isExpired) {
        await OTP.deleteMany({ email }) // Cleanup expired OTPs
        throw new Error('OTP has expired')
    }

    const hash = crypto.createHash('sha256').update(token).digest('hex')
    return hash === otpEntry.hash
})
