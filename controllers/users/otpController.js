import * as otpService from '../../services/otpService.js'
import catchAsync from '../../utils/catchAsync.js'

// Controller for email OTP generation
export const sendEmailOTP = catchAsync(async (req, res, next) => {
    const { email } = req.body
    const { token, hash } = otpService.generateOTP()

    await otpService.sendEmail(email, token)
    await otpService.saveOTP(email, null, hash)

    res.status(200).json({ message: 'OTP sent successfully to your email.' })
})

// Controller for phone OTP generation
export const sendPhoneOTP = catchAsync(async (req, res, next) => {
    const { phone } = req.body
    const { token, hash } = otpService.generateOTP()

    await otpService.sendSMS(phone, token)
    await otpService.saveOTP(null, phone, hash)

    res.status(200).json({
        message: 'OTP sent successfully to your phone.',
    })
})

export const verifyOneTimePassword = catchAsync(async (req, res) => {
    const { token, email } = req.body

    const isValid = await otpService.validateOTP(token, email)

    if (!isValid) {
        return res.status(400).json({ error: 'Invalid OTP' })
    }

    return res.status(200).json({ message: 'OTP verified successfully.' })
})
