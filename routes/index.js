import express from 'express'

import adminRoutes from './admin/index.js'
import userRoutes from './users/index.js'
// import transcationRoutes from './transcationRoutes/index.js'

const router = express.Router()

// ADMIN DB ROUTES
router.use('/admin', adminRoutes)

// USER DB ROUTES
router.use('/user', userRoutes)

// SELLER DB ROUTES

// TRANSACTION DB ROUTES
// router.use('/transcation', transcationRoutes)

export default router
