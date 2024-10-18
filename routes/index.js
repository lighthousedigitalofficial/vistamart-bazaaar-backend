import express from 'express'

import adminRoutes from './admin/index.js'
import userRoutes from './users/index.js'
import uploadRoutes from './uploadRoutes.js'

import transactionRoutes from './transactions/index.js'
import sellerRoutes from './sellers/index.js'

const router = express.Router()

// Image routes
router.use('/image', uploadRoutes)

// ADMIN DB ROUTES
router.use('/admin', adminRoutes)

// USER DB ROUTES
router.use('/user', userRoutes)

// SELLER DB ROUTES
router.use('/seller', sellerRoutes)

// TRANSACTION DB ROUTES
router.use('/transaction', transactionRoutes)

export default router
