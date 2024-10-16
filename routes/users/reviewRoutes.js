import express from 'express'

import { protect, restrictTo } from './../../middleware/authMiddleware.js'
import reviewValidationSchema from './../../validations/reviewValidator';

import { createProductReview, deleteProductReview,

    getAllProductReviews,
    getProductReviewById,
    updateProductReview,
    updateProductReviewStatus,getProductWithReviews } from '../../controllers/users/reviewController.js'
import { validateSchema } from '../../middleware/validationMiddleware.js';

const router = express.Router()

router
    .route('/')
    .post(protect, validateSchema(reviewValidationSchema), createProductReview)
    .get(getAllProductReviews)

router
    .route('/:id')
    .get(protect, getProductReviewById)
    .put(protect, updateProductReview)
    .delete(protect, restrictTo('admin'), deleteProductReview)

router.put(
    '/status/:id',
    protect,
    restrictTo('admin', 'vendor'),
    updateProductReviewStatus
)

//Fetch Reviews wiyh productId
router.get('/produtId', getProductWithReviews)

export default router
