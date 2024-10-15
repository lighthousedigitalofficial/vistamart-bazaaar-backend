import express from 'express'
import { createRole } from '../../controllers/admin/roleController.js'

const router = express.Router()

router.route('/').post(createRole)
//  .get(getRoles)

router
    .route('/:id')
    .get(protect, restrictTo('admin'), getRoleById)
    .put(protect, restrictTo('admin'), updateRole)
    .delete(protect, restrictTo('admin'), deleteRole)

export default router
