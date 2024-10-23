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
import Customer from '../../models/users/customerModel.js'

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

// Get all orders
export const getAllOrders = catchAsync(async (req, res, next) => {
    const cacheKey = getCacheKey('Order', '', req.query)

    // Check cache first
    const cachedDoc = await redisClient.get(cacheKey)

    if (cachedDoc !== null) {
        return res.status(200).json({
            status: 'success',
            cached: true,
            results: JSON.parse(cachedDoc).length,
            doc: JSON.parse(cachedDoc),
        })
    }

    // EXECUTE QUERY
    let query = Order.find().lean()

    const features = new APIFeatures(query, req.query)
        .filter()
        .sort()
        .fieldsLimit()
        .paginate()

    const orders = await features.query

    if (!orders || orders.length === 0) {
        return next(new AppError('No orders found', 404))
    }

    const updatedOrders = await Promise.all(
        orders.map(async (doc) => {
            let products = await Product.find({
                _id: { $in: doc.products },
            }).lean()
            if (!products || products.length === 0) {
                products = []
            }

            let vendors = await Vendor.find({
                _id: { $in: doc.vendors },
            }).lean()
            if (!vendors || vendors.length === 0) {
                vendors = []
            }

            let customer = await Customer.findById(doc.customer).lean()
            if (!customer) {
                customer = {}
            }

            return {
                ...doc,
                products,
                vendors,
                customer,
            }
        })
    )

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(updatedOrders))

    res.status(200).json({
        status: 'success',
        cached: false,
        results: updatedOrders.length,
        doc: updatedOrders,
    })
})

// Delete an order

const relatedModels = [{ model: Refund, foreignKey: 'order' }]

export const deleteOrder = deleteOneWithTransaction(Order, relatedModels)

// Get order by ID
export const getOrderById = catchAsync(async (req, res, next) => {
    const { id } = req.params

    // Fetch the order by ID
    const order = await Order.findById(id)

    if (!order) {
        return next(new AppError('No order found with that ID', 404))
    }

    // Fetch related data from the respective models
    const products = await Product.find({ _id: { $in: order.products } })
    const vendors = await Vendor.find({ _id: { $in: order.vendors } })
    // const customer = await Customer.findById(order.customer);

    // Map products and vendors by their IDs for efficient lookup
    const productsMap = products.reduce((map, product) => {
        map[product._id] = product
        return map
    }, {})

    const vendorsMap = vendors.reduce((map, vendor) => {
        map[vendor._id] = vendor
        return map
    }, {})

    // Map the products array to their corresponding product documents
    const orderProducts = order.products.map(
        (productId) => productsMap[productId] || null
    )

    // Map the vendors array to their corresponding vendor documents
    const orderVendors = order.vendors.map(
        (vendorId) => vendorsMap[vendorId] || null
    )

    // Add full details of customer, products, and vendors to the order
    const enrichedOrder = {
        ...order._doc, // Spread the existing order fields
        // customer, // Add the customer object
        products: orderProducts, // Add the full product objects
        vendors: orderVendors, // Add the full vendor objects
    }

    res.status(200).json({
        status: 'success',
        doc: {
            order: enrichedOrder,
        },
    })
})

// Update an order's status
export const updateOrderStatus = catchAsync(async (req, res, next) => {
    if (!req.body.status) {
        return next(new AppError(`Please provide status value.`, 400))
    }

    // Perform the update operation
    const doc = await Order.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        {
            new: true,
            runValidators: true,
        }
    )

    // Handle case where the document was not found
    if (!doc) {
        return next(new AppError(`No Order found with that ID`, 404))
    }

    // If the order status is 'delivered', increment the product sell count
    if (req.body.status === 'delivered') {
        // Assuming `products` is an array of product IDs in the order
        const productIds = doc.products

        for (const productId of productIds) {
            await Product.findByIdAndUpdate(
                productId,
                { $inc: { sell: 1 } }, // Increment the sell count by 1
                { new: true }
            )
        }
    }

    // Handle Redis cache
    const cacheKeyOne = getCacheKey(Model.modelName, req.params.id)
    await redisClient.del(cacheKeyOne)
    await redisClient.setEx(cacheKeyOne, 3600, JSON.stringify(doc))

    // Update list cache
    const cacheKey = getCacheKey(Model.modelName, '', req.query)
    await redisClient.del(cacheKey)

    res.status(200).json({
        status: 'success',
        doc,
    })
})

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
