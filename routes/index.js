import express from 'express'

import adminRoutes from './admin/index.js'
import userRoutes from './users/index.js'
import sellerRoutes from './sellers/index.js'
// import transcationRoutes from './transcationRoutes/index.js'
import uploadRoutes from './uploadRoutes.js'

const router = express.Router()

// Image routes
router.use('/upload', uploadRoutes)

// ADMIN DB ROUTES
router.use('/admin', adminRoutes)

// USER DB ROUTES
router.use('/user', userRoutes)

// SELLER DB ROUTES
router.use('/seller', sellerRoutes)

// TRANSACTION DB ROUTES
// router.use('/transcation', transcationRoutes)

export default router
