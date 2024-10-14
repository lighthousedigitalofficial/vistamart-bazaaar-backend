import express from 'express'

// import flashDeal from './flashDealRoutes.js'
// import dealOfDay from './dealOfTheDayRoutes.js'
// import featureddeal from './featuredDealRoutes.js'
// import notification from './notificationRoutes.js'

import couponRoutes from './couponRoutes.js'
import colorRoutes from './colorRoutes.js'
import bannerRoutes from './bannerRoutes.js'
import attributeRoutes from './attributeRoutes.js'
import employeeRoutes from './employeeRoutes.js'
import roleRoutes from './roleRoutes.js'
import categoryRoutes from './categories/categoryRoutes.js'
import subCategoryRoutes from './categories/subCategoryRoutes.js'
import subSubCategoryRoutes from './categories/subSubCategoryRoutes.js'

const router = express.Router()

router.use('/employees', employeeRoutes)
router.use('/roles', roleRoutes)

router.use('/categories', categoryRoutes)
router.use('/sub-categories', subCategoryRoutes)
router.use('/sub-sub-categories', subSubCategoryRoutes)

router.use('/attributes', attributeRoutes)
router.use('/banners', bannerRoutes)
router.use('/colors', colorRoutes)
router.use('/coupons', couponRoutes)
// router.use('/brands', brandsRoutes)

// router.use('/notifications', notification)
// router.use('/flash-deals', flashDeal)
// router.use('/deal-of-day', dealOfDay)
// router.use('/featured-deals', featureddeal)

export default router
