import express from 'express'
import { createRole,getRoles } from '../../controllers/admin/roleController.js'

const router = express.Router()

router.route('/').post(createRole)
 .get(getRoles)

// router
//     .route('/:id')
//     .get(getRoleById)
//     .put(updateRole)
//     .delete( deleteRole)

export default router
