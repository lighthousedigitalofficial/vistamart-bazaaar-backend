import mongoose from 'mongoose'
import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
    updateStatus,
} from '../../../factory/handleFactory.js'
import FeaturedDeal from '../../../models/admin/deals/featuredDealModel.js'
import Product from '../../../models/sellers/productModel.js'
import catchAsync from '../../../utils/catchAsync.js'
import { getCacheKey } from '../../../utils/helpers.js'
import redisClient from '../../../config/redisConfig.js'
import AppError from '../../../utils/appError.js'

// Create Feature Deal
export const createFeaturedDeal = createOne(FeaturedDeal)

// Get Feature Deals
export const getFeaturedDeals = getAll(FeaturedDeal)

// Get Feature Deal by ID
export const getFeaturedDealById = catchAsync(async (req, res, next) => {
    const cacheKey = getCacheKey('FeaturedDeal', req.params.id)

    // Check cache first
    const cachedDoc = await redisClient.get(cacheKey)

    if (cachedDoc) {
        return res.status(200).json({
            status: 'success',
            cached: true,
            doc: JSON.parse(cachedDoc),
        })
    }

    // If not in cache, fetch from database
    let doc = await FeaturedDeal.findById(req.params.id).lean()

    if (!doc) {
        return next(new AppError(`No flash deal found with that ID`, 404))
    }

    const products = await Product.find({
        _id: { $in: doc.products },
    }).lean()

    // If no reviews are found, initialize with an empty array
    if (!products || products.length === 0) {
        updateProductStatus = []
    }

    // Add reviews (empty array if none found)
    doc = {
        ...doc,
        products,
    }

    // Cache the result
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(doc))

    res.status(200).json({
        status: 'success',
        cached: false,
        doc,
    })
})


// Update Feature Deal
export const updateFeaturedDeal = updateOne(FeaturedDeal)
// Add Product to Feature Deal
export const addProductToFeaturedDeal = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const { productId } = req.body

    // Check if the product exists
    const product = await Product.findById(productId)
    if (!product) {
        return next(new AppError('Product not found', 404))
    }

    const featuredDeal = await FeaturedDeal.findById(id)

    if (!featuredDeal) {
        return next(new AppError('Feature Deal not found', 404))
    }

    // Add the product to the feature deal if it isn't already included
    if (!featuredDeal.products.includes(productId)) {
        featuredDeal.products.push(productId)
        await featuredDeal.save()
    }

    const cacheKeyOne = getCacheKey('FeaturedDeal', featuredDeal?._id)
    await redisClient.setEx(cacheKeyOne, 3600, JSON.stringify(featuredDeal))

    // delete all documents caches related to this model
    const cacheKey = getCacheKey('FeaturedDeal', '')
    await redisClient.del(cacheKey)

    res.status(201).json({
        status: 'success',
        doc: featuredDeal,
    })
})

// Remove Product from Feature Deal
export const removeProductFromFeaturedDeal = catchAsync(
    async (req, res, next) => {
        const { id } = req.params
        const { productId } = req.body

        const product = await Product.findById(productId)
        if (!product) {
            return next(new AppError('Product not found', 404))
        }

        const featuredDeal = await FeaturedDeal.findById(id)
        if (!featuredDeal) {
            return next(new AppError('Feature Deal not found', 404))
        }

        // Convert productId string to ObjectId
        const productObjectId = new mongoose.Types.ObjectId(productId)

        // Check if the product is part of the featured deal
        if (!featuredDeal.products.some((pid) => pid.equals(productObjectId))) {
            return next(new AppError('Product not found in Featured Deal', 404))
        }

        // Remove the product from the featured deal's product list
        featuredDeal.products = featuredDeal.products.filter(
            (pid) => !pid.equals(productObjectId)
        )

        await featuredDeal.save()

        const cacheKeyOne = getCacheKey('FeaturedDeal', id)
        await redisClient.del(cacheKeyOne)

        // delete all documents caches related to this model
        const cacheKey = getCacheKey('FeaturedDeal', '')
        await redisClient.del(cacheKey)

        res.status(204).json({
            status: 'success',
            doc: featuredDeal,
        })
    }
)

// Update Feature Deal Status
export const updateFeaturedDealStatus = updateStatus(FeaturedDeal)

// Delete Feature Deal
export const deleteFeaturedDeal = deleteOne(FeaturedDeal)
