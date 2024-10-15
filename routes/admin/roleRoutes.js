import express from 'express'
import {
    createRole,
    deleteRole,
    getRoleById,
    getRoles,
    updateRole,
} from '../../controllers/admin/roleController.js'
import { protect, restrictTo } from '../../middleware/authMiddleware.js'

const router = express.Router()

router
    .route('/')
    .post(protect, restrictTo('admin'), createRole)
    .get(protect, restrictTo('admin'), getRoles)

router
    .route('/:id')
    .get(protect, restrictTo('admin'), getRoleById)
    .put(protect, restrictTo('admin'), updateRole)
    .delete(protect, restrictTo('admin'), deleteRole)

export default router
