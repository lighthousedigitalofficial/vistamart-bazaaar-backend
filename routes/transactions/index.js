import express from 'express';
import transactionRoutes from './transactionRoutes.js'
import redundRoutes from './refundRoutes.js'
import orderRoutes from  './orderRoutes.js'
import adminWalletRoutes from './adminWalletRoutes.js'

const router = express.Router();

// Use the various route files
router.use('/orders', orderRoutes);
router.use('/refunds', redundRoutes);
router.use('/wallet', adminWalletRoutes);
router.use('/transaction', transactionRoutes);

export default router;
