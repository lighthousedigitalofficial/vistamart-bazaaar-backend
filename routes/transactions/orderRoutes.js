import express from 'express'
import {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    getOrderByCustomer,
} from '../../controllers/transactions/orderControllers.js'
import { validateSchema } from '../../middleware/validationMiddleware.js'
import orderValidationSchema from '../../validations/admin/transactions/orderValidator.js'
import { protect } from '../../middleware/authMiddleware.js'
import { restrictTo } from '../../middleware/authMiddleware.js'

const router = express.Router()

router
    .route('/')
    .post(
        protect,
        // validateSchema(orderValidationSchema),
        createOrder
    )
    .get(protect, restrictTo('admin', 'vendor'), getAllOrders)

router.get('/customer/:customerId', getOrderByCustomer)

router
    .route('/:id')
    .get(protect, getOrderById)
    .delete(protect, restrictTo('admin', 'vendor'), deleteOrder)

router
    .route('/status/:id')
    .put(protect, restrictTo('admin', 'vendor'), updateOrderStatus)

export default router
