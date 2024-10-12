import express from 'express'

import adminRoutes from './admin/index.js'
import userRoutes from './users/index.js'
// import transcationRoutes from './transcationRoutes/index.js'

const router = express.Router()

router.use('/admin', adminRoutes)
router.use('/user', userRoutes)
// router.use('/transcation', transcationRoutes)

export default router
