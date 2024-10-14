import express from 'express'

// import productRoutes from './productRoutes.js'
// import colorRoutes from './colorRoutes.js'
// import banner from './bannerRoutes.js'
// import flashDeal from './flashDealRoutes.js'
// import dealOfDay from './dealOfTheDayRoutes.js'
// import featureddeal from './featuredDealRoutes.js'
// import coupons from './couponRoutes.js'
// import notification from './notificationRoutes.js'

import attributeRoutes from './attributeRoutes.js'
import attributeRoutes from './attributeRoutes.js'
import employeeRoutes from './employeeRoutes.js'
import roleRoutes from './roleRoutes.js'
import categoryRoutes from './categories/categoryRoutes.js'
import subCategoryRoutes from './categories/subCategoryRoutes.js'
import subSubCategoryRoutes from './categories/subSubCategoryRoutes.js'

const router = express.Router()

router.use('/employees', employeeRoutes)
router.use('/roles', roleRoutes)
router.use('/attributes', attributeRoutes)

// router.use('/products', productRoutes)
// router.use('/brands', brandsRoutes)
router.use('/categories', categoryRoutes)
router.use('/sub-categories', subCategoryRoutes)
router.use('/sub-sub-categories', subSubCategoryRoutes)
router.use('/attributes', attributeRoutes)
// router.use('/colors', colorRoutes)
// router.use('/banners', banner)
// router.use('/notifications', notification)
// router.use('/flash-deals', flashDeal)
// router.use('/deal-of-day', dealOfDay)
// router.use('/featured-deals', featureddeal)
// router.use('/coupons', coupons)

export default router
