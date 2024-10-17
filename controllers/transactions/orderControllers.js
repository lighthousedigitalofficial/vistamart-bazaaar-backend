import redisClient from '../../config/redisConfig.js'
import Coupon from '../../models/sellers/couponModel.js' // Adjust this based on your actual directory structure
import Order from '../../models/transactions/orderModel.js'
import AppError from '../../utils/appError.js'
import Refund from '../../models/transactions/refundModel.js'
import APIFeatures from '../../utils/apiFeatures.js'
import catchAsync from '../../utils/catchAsync.js'
import { getCacheKey } from '../../utils/helpers.js'
import {
    deleteOneWithTransaction,
    getAll,
    getOne,
    updateStatus,
} from '../../factory/handleFactory.js'
import Product from '../../models/sellers/productModel.js'
import Vendor from '../../models/sellers/vendorModel.js'

const updateCouponUserLimit = catchAsync(async (_couponId, next) => {
    // Find the coupon by ID
    const coupon = await Coupon.findById(_couponId)

    if (!coupon) {
        return next(new AppError(`No coupon found by that ID.`, 404))
    }

    // Check if the used count has reached or exceeded the limit
    if (coupon.userLimit.used >= coupon.userLimit.limit) {
        return next(new AppError(`Coupon is expired.`, 400))
    }

    // Increment the used field by 1
    coupon.userLimit.used += 1
    await coupon.save({ validateBeforeSave: true })
})

// Create a new order
export const createOrder = catchAsync(async (req, res, next) => {
    const {
        couponId,
        customerId,
        vendors,
        products,
        totalAmount,
        paymentMethod,
        shippingMethod,
        shippingAddress,
        billingAddress,
        orderNote,
    } = req.body

    if (couponId) {
        updateCouponUserLimit(couponId, next)
    }

    function generateOrderId() {
        // Generates a random number between 1000 and 9999
        return Math.floor(1000 + Math.random() * 9000)
    }

    const newOrder = {
        orderId: generateOrderId(),
        coupon: couponId ? couponId : undefined,
        customer: customerId,
        vendors,
        products,
        totalAmount,
        paymentMethod,
        shippingMethod,
        shippingAddress,
        billingAddress,
        orderNote,
    }

    const doc = await Order.create(newOrder)

    if (!doc) {
        return next(new AppError(`Order could not be created`, 400))
    }

    const cacheKeyOne = getCacheKey('Order', doc?._id)
    await redisClient.setEx(cacheKeyOne, 3600, JSON.stringify(doc))

    // delete all documents caches related to this model
    const cacheKey = getCacheKey('Order', '', req.query)
    await redisClient.del(cacheKey)

    res.status(201).json({
        status: 'success',
        doc,
    })
})

// export const getAllOrders = getAll(Order)

export const getAllOrders = catchAsync(async (req, res, next) => {
    const cacheKey = getCacheKey('Order', '', req.query)

    // Check cache first
    const cacheddoc = await redisClient.get(cacheKey)

    if (cacheddoc !== null) {
        return res.status(200).json({
            status: 'success',
            cached: true,
            results: JSON.parse(cacheddoc).length,
            doc: JSON.parse(cacheddoc),
        })
    }

    // EXECUTE QUERY
    let query = Order.find()

    const products = await Product.find()
    const vendors = await Vendor.find()

    // If not in cache, fetch from database

    const features = new APIFeatures(query, req.query)
        .filter()
        .sort()
        .fieldsLimit()
        .paginate()

    const doc = await features.query

    console.log(doc)

    // Map products and vendors by their IDs for efficient lookup
    const productsMap = products.reduce((map, product) => {
        map[product._id] = product
        return map
    }, {})

    const vendorsMap = vendors.reduce((map, vendor) => {
        map[vendor._id] = vendor
        return map
    }, {})

    // Add products and vendors to each order
    const enrichedOrders = doc.map((order) => {
        // Map the products array to their corresponding product documents
        const orderProducts = order.products.map(
            (productId) => productsMap[productId] || null
        )

        // Map the vendors array to their corresponding vendor documents
        const orderVendors = order.vendors.map(
            (vendorId) => vendorsMap[vendorId] || null
        )

        return {
            ...order._doc, // spread the order fields
            products: orderProducts, // add the full product objects
            vendors: orderVendors, // add the full vendor objects
        }
    })

    // Cache the result
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(enrichedOrders))

    res.status(200).json({
        status: 'success',
        cached: false,
        results: enrichedOrders.length,
        doc: enrichedOrders,
    })
})
// Delete an order

const relatedModels = [{ model: Refund, foreignKey: 'order' }]

export const deleteOrder = deleteOneWithTransaction(Order, relatedModels)

// Get order by ID
export const getOrderById = getOne(Order)

// Update an order's status
export const updateOrderStatus = updateStatus(Order)

export const getOrderByCustomer = catchAsync(async (req, res, next) => {
    const customerId = req.params.customerId

    // Check cache first
    const cacheKey = getCacheKey('Order', customerId)
    const cachedDoc = await redisClient.get(cacheKey)

    if (cachedDoc) {
        return res.status(200).json({
            status: 'success',
            cached: true,
            doc: JSON.parse(cachedDoc),
        })
    }

    // If not in cache, fetch from database
    const doc = await Order.findOne({ customer: customerId })

    if (!doc) {
        return next(new AppError(`No Order found with that customer Id`, 404))
    }

    // Cache the result
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(doc))

    res.status(200).json({
        status: 'success',
        cached: false,
        doc,
    })
})
