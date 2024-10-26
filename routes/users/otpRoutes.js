import { Router } from 'express'
import * as otpController from '../controllers/otpController.js'

const router = Router()

// otpRoutes.js

router.post('/send-email', otpController.sendEmailOTP) // Route for email OTP
router.post('/send-phone', otpController.sendPhoneOTP) // Route for phone OTP
router.post('/verify', otpController.verifyOTP) // Common route for OTP verification

export default router
