import express from 'express'
<<<<<<< HEAD
import { createRole } from '../../controllers/admin/roleController.js'

const router = express.Router()

router.route('/').post(createRole)
//  .get(getRoles)
=======
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
>>>>>>> 7007a795fbf642690ef3157bef3c559ba6f24c88

router
    .route('/:id')
    .get(protect, restrictTo('admin'), getRoleById)
    .put(protect, restrictTo('admin'), updateRole)
    .delete(protect, restrictTo('admin'), deleteRole)

export default router
