import slugify from 'slugify'
import Brand from '../../models/admin/brandModel.js'
import catchAsync from '../../utils/catchAsync.js'

import { getCacheKey } from '../../utils/helpers.js'
import redisClient from '../../config/redisConfig.js'
import APIFeatures from '../../utils/apiFeatures.js'

import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    getOneBySlug,
    updateStatus,
} from '../../factory/handleFactory.js'
import Product from '../../models/sellers/productModel.js'

// Create a new brand
export const createBrand = createOne(Brand)

export const getBrands = catchAsync(async (req, res, next) => {
    const cacheKey = getCacheKey('Brand', '', req.query)

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
    let query = Brand.find()

    const features = new APIFeatures(query, req.query)
        .filter()
        .sort()
        .fieldsLimit()
        .paginate()

    const doc = await features.query

    // Cache the result
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(doc))

    res.status(200).json({
        status: 'success',
        cached: false,
        results: doc.length,
        doc,
    })
})

// Get a brand by ID
export const getBrandById = getOne(Brand)

export const getBrandBySlug = getOneBySlug(Brand)
// Update a brand by ID
export const updateBrand = catchAsync(async (req, res) => {
    const { name, imageAltText, logo } = req.body

    const doc = await Brand.findByIdAndUpdate(
        req.params.id,
        { name, logo, imageAltText },
        { new: true }
    )

    // Handle case where the document was not found
    if (!doc) {
        return next(new AppError('No document found with that ID', 404))
    }

    // Update cache
    const cacheKey = getCacheKey('Brand', '', req.query)
    await redisClient.del(cacheKey)

    res.status(200).json({
        status: 'success',
        doc,
    })
})
// Delete a brand by ID
export const deleteBrand = deleteOne(Brand)
// Update a brand's status by ID
export const updateBrandStatus = updateStatus(Brand)
