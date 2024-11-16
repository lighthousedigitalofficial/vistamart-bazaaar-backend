import catchAsync from '../../utils/catchAsync.js'
import Customer from '../../models/users/customerModel.js'
import Vendor from '../../models/sellers/vendorModel.js'
import Product from '../../models/sellers/productModel.js'
import Order from '../../models/transactions/orderModel.js'
import { getCacheKey } from '../../utils/helpers.js'
import redisClient from '../../config/redisConfig.js'

export const getAdminBusinessAnalytics = catchAsync(async (req, res, next) => {
    const cacheKey = 'adminBusinessAnalytics'

    // Check cache first
    const cachedDoc = await redisClient.get(cacheKey)

    if (cachedDoc) {
        return res.status(200).json({
            status: 'success',
            cached: true,
            doc: JSON.parse(cachedDoc),
        })
    }

    // Execute all count queries in parallel
    const [
        totalOrders,
        totalProducts,
        totalCustomers,
        totalStores,
        pendingOrders,
        confirmedOrders,
        packagingOrders,
        outForDeliveryOrders,
        deliveredOrders,
        failedToDeliverOrders,
        returnedOrders,
        canceledOrders,
    ] = await Promise.all([
        Order.countDocuments(),
        Product.countDocuments(),
        Customer.countDocuments(),
        Vendor.countDocuments(),
        Order.countDocuments({ status: 'pending' }),
        Order.countDocuments({ status: 'confirmed' }),
        Order.countDocuments({ status: 'packaging' }),
        Order.countDocuments({ status: 'out_for_delivery' }),
        Order.countDocuments({ status: 'delivered' }),
        Order.countDocuments({ status: 'failed_to_deliver' }),
        Order.countDocuments({ status: 'returned' }),
        Order.countDocuments({ status: 'canceled' }),
    ])

    // Construct the response document
    const doc = {
        totalOrders,
        totalProducts,
        totalCustomers,
        totalStores,
        ordersByStatus: {
            pending: pendingOrders,
            confirmed: confirmedOrders,
            packaging: packagingOrders,
            out_for_delivery: outForDeliveryOrders,
            delivered: deliveredOrders,
            failed_to_deliver: failedToDeliverOrders,
            returned: returnedOrders,
            canceled: canceledOrders,
        },
    }

    // Cache the result for 1 minute (60 seconds)
    await redisClient.setEx(cacheKey, 60, JSON.stringify(doc))

    // Send the response
    res.status(200).json({
        status: 'success',
        cached: false,
        doc,
    })
})

export const getVendorBusinessAnalytics = catchAsync(async (req, res, next) => {
    const vendor = req.user._id
    //Get total orders count
    const totalOrders = await Order.countDocuments()

    // Get total products count
    const totalProducts = await Product.countDocuments()

    // Get order statuses count
    const pendingOrders = await Order.countDocuments({ status: 'pending' })
    const confirmedOrders = await Order.countDocuments({
        status: 'confirmed',
    })
    const packagingOrders = await Order.countDocuments({
        status: 'packaging',
    })
    const outForDeliveryOrders = await Order.countDocuments({
        status: 'out_for_delivery',
    })
    const deliveredOrders = await Order.countDocuments({
        status: 'delivered',
    })
    const failedToDeliverOrders = await Order.countDocuments({
        status: 'failed_to_deliver',
    })
    const returnedOrders = await Order.countDocuments({
        status: 'returned',
    })
    const canceledOrders = await Order.countDocuments({
        status: 'canceled',
    })

    const doc = {
        totalOrders,
        totalProducts,
        ordersByStatus: {
            pending: pendingOrders,
            confirmed: confirmedOrders,
            packaging: packagingOrders,
            out_for_delivery: outForDeliveryOrders,
            delivered: deliveredOrders,
            failed_to_deliver: failedToDeliverOrders,
            returned: returnedOrders,
            canceled: canceledOrders,
        },
    }

    const cacheKey = getCacheKey('Business')
    await redisClient.setEx(cacheKey, 60, JSON.stringify(doc))

    // Send the response
    res.status(200).json({
        status: 'success',
        cached: false,
        doc,
    })
})
