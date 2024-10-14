import express from 'express'
import {
    createBanner,
    getBanners,
    updateBanner,
    deleteBanner,
    getBannerById,
    updateBannerPublishStatus,
} from '../../controllers/admin/bannerController.js'
import checkObjectId from '../../middleware/checkObjectId.js'
import { protect, restrictTo } from './../../middleware/authMiddleware.js'

const router = express.Router()

router
    .route('/')
    .post(
        // protect, restrictTo('admin'),
        createBanner
    )
    .get(getBanners)

router
    .route('/:id', checkObjectId)
    .get(getBannerById)
    .put(
        // protect, restrictTo('admin'),
        updateBanner
    )
    .delete(
        // protect, restrictTo('admin'),
        deleteBanner
    )

router.put('/publish/:id', updateBannerPublishStatus)

export default router
