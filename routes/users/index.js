import express from 'express'

import customerRoutes from './customerRoutes.js'
import subscriberRoutes from './subscriberRoutes.js'
// import searchRoutes from './searchRoutes.js'
// import reviewRoutes from './reviewRoutes.js'
// import whishlist from './wishlistRoutes.js'
// import vendorBankRoutes from '../sellers/vendorBankRotues.js'
// import vendorRoutes from '../sellers/vendorRoutes.js'

const router = express.Router()

router.use('/customers', customerRoutes)
router.use('/subscribers', subscriberRoutes)

// router.use('/reviews', reviewRoutes)
// router.use('/wishlists', whishlist)
// router.use('/search', searchRoutes)
// router.use('/vendors', vendorRoutes)
// router.use('/vendor-banks', vendorBankRoutes)

export default router
