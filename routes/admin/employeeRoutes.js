import express from 'express'

import {
    createEmployee,
    getEmployeeById,
    getEmployees,
    updateEmployee,
    deleteEmployee,
    updateEmployeeStatus,
} from '../../controllers/admin/employeeController.js'
import {
    login,
    logout,
    updatePassword,
} from '../../controllers/authController.js'

import {
    protect,
    restrictTo,
    selectModelByRole,
} from '../../middleware/authMiddleware.js'
// import { validateSchema } from '../middleware/validationMiddleware.js'
// import EmployeeValidationSchema from './../validations/EmployeeValidator.js'
// import { loginLimiter } from '../utils/helpers.js'

const router = express.Router()

router.post('/login', login)
router.post('/logout', protect, logout)

router.put('/update-password', protect, selectModelByRole, updatePassword)

router
    .route(
        '/'
        // protect, restrictTo('admin')
    )
    .post(createEmployee)
    .get(getEmployees)

router
    .route(
        '/:id'
        // protect, restrictTo('admin')
    )
    .get(getEmployeeById)
    .delete(deleteEmployee)
    .put(updateEmployee)

router.put('/slug/:id', updateEmployeeStatus)

export default router
