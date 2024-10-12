import searchRoutes from './searchRoutes.js'
import reviewRoutes from './reviewRoutes.js'
import whishlist from './wishlistRoutes.js'
import customerRoutes from './customerRoutes.js'
import vendorBankRoutes from '../sellers/vendorBankRotues.js'
import vendorRoutes from '../sellers/vendorRoutes.js'

router.use('/reviews', reviewRoutes)
router.use('/customers', customerRoutes)
router.use('/wishlists', whishlist)
router.use('/search', searchRoutes)
router.use('/vendors', vendorRoutes)
router.use('/vendor-banks', vendorBankRoutes)
