import express from 'express'

import {
    createEmployee,
    getEmployeeById,
    getEmployees,
    updateEmployee,
    deleteEmployee,
    updateEmployeeStatus,
    employeeLogin,
} from '../../controllers/admin/employeeController.js'

import { logout, updatePassword } from '../../controllers/authController.js'

import {
    protect,
    restrictTo,
    selectModelByRole,
} from '../../middleware/authMiddleware.js'
// import { validateSchema } from '../middleware/validationMiddleware.js'
// import EmployeeValidationSchema from './../validations/EmployeeValidator.js'
// import { loginLimiter } from '../utils/helpers.js'

const router = express.Router()

router.post('/login', employeeLogin)
router.post('/logout', protect, logout)

router.put('/update-password', protect, selectModelByRole, updatePassword)

router.route('/').post(protect, createEmployee).get(protect, getEmployees)

router
    .route('/:id')
    .get(protect, restrictTo('admin'), getEmployeeById)
    .delete(protect, restrictTo('admin'), deleteEmployee)
    .put(protect, restrictTo('admin'), updateEmployee)

router.put('/status/:id', protect, restrictTo('admin'), updateEmployeeStatus)

export default router
