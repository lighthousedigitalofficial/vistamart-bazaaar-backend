import express from 'express'

import {
    createCategory,
    deleteCategory,
    getCategories,
    getCategoryById,
    getCategoryBySlug,
    updateCategory,
    updateCategoryStatus,
} from './../../../controllers/admin/categories/categoryController.js'

import { validateSchema } from '../../../middleware/validationMiddleware.js'
import categoryValidationSchema from './../../../validations/admin/categories/categoryValidator.js'
import { protect, restrictTo } from './../../../middleware/authMiddleware.js'

const router = express.Router()

router
  .route("/")
  .post(protect, validateSchema(categoryValidationSchema), createCategory)

    .get(getCategories)

router
  .route("/:id")
  .get(getCategoryById)
  .put(protect, restrictTo("admin"), updateCategory)
  .delete(protect, restrictTo("admin"), deleteCategory);


router.route('/slug/:slug').get(getCategoryBySlug)

router
    .route('/:id/status')
    .put(protect, restrictTo('admin'), updateCategoryStatus)

export default router
