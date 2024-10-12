import express from 'express'
import { createEmployee } from '../../controllers/admin/employeeController.js'

const router = express.Router()

router.route('/').post(createEmployee)
//  .get(getEmployees)

// router
//     .route('/:id')
//     .get(getEmployeeById)
//     .put(updateEmployee)
//     .delete( deleteEmployee)

export default router
