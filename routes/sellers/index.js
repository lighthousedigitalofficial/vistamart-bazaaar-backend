import express from 'express'
import vendorRoutes from './vendorRoutes.js'
import vendorBankRoutes from './vendorBankRotues.js'
import couponRoutes from "./couponRoutes.js"
const router = express.Router()

// SELLER DB ROUTES
router.use('/vendor', vendorRoutes)
router.use('/vendorBank', vendorBankRoutes)
router.use('/coupon',couponRoutes)

export default router
