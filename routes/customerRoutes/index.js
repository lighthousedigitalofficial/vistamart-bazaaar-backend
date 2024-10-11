import searchRoutes from './searchRoutes.js'
import reviewRoutes from './reviewRoutes.js'
import whishlist from './wishlistRoutes.js'
import customerRoutes from './customerRoutes.js'

router.use('/reviews', reviewRoutes)
router.use('/customers', customerRoutes)
router.use('/wishlists', whishlist)
router.use('/search', searchRoutes)
