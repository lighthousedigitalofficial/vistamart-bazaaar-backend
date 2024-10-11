import express from 'express'

import adminRoutes from './adminRoutes/index.js'
import customerRoutes from './customerRoutes/index.js'
import transcationRoutes from './transcationRoutes/index.js'

const router = express.Router()

router.use('/admin', adminRoutes)
router.use('/customer', customerRoutes)
router.use('/transcation', transcationRoutes)

export default router
