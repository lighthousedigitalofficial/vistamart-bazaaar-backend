import adminWalletRoutes from './adminWalletRoutes.js'
import oderRoutes from './orderRoutes.js'
import refundRoutes from './refundRoutes.js'

router.use('/orders', oderRoutes)
router.use('/refunds', refundRoutes)
router.use('/wallet', adminWalletRoutes)
