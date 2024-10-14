import express from 'express'

import adminWalletRoutes from './adminWalletRoutes.js'
import oderRoutes from './orderRoutes.js'
import refundRoutes from './refundRoutes.js'

const router = express.Router()

router.use('/orders', oderRoutes)
router.use('/refunds', refundRoutes)
router.use('/wallet', adminWalletRoutes)

export default router
