import {
    deleteOneWithTransaction,
    getAll,
    getOne,
    updateStatus,
    updateOne,
} from '../../factory/handleFactory.js'
import catchAsync from '../../utils/catchAsync.js'
import AppError from '../../utils/appError.js'
import { getCacheKey } from '../../utils/helpers.js'
import redisClient from '../../config/redisConfig.js'
import Product from '../../models/admin/business/productBusinessModel.js'
import Vendor from '../../models/sellers/vendorModel.js'
import slugify from 'slugify'

// Vendor registration (similar to createVendor but may have different logic)
export const registerVendor = catchAsync(async (req, res, next) => {
    const {
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
        shopName,
        address,
    } = req.body

    const { vendorImage, logo, banner } = req.body

    const newVendor = new Vendor({
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
        shopName,
        address,
        vendorImage,
        logo,
        banner,
    })

    const doc = await newVendor.save()

    if (!doc) {
        return next(new AppError(`Vendor could not be created`, 400))
    }

    // Delete all documents caches related to this model
    const cacheKey = getCacheKey('Vendor', '', req.query)
    await redisClient.del(cacheKey)

    res.status(201).json({
        status: 'success',
        doc,
    })
})

//update the slug on the basis of shop name
export const updateVendorWithSlug = catchAsync(async (req, res, next) => {
    const { id } = req.params

    const vendor = await Vendor.findById(id)
    if (!vendor) {
        return next(new AppError(`No vendor found with that ID`, 404))
    }

    const updatedData = { ...req.body }

    if (updatedData.shopName) {
        updatedData.slug = slugify(updatedData.shopName, { lower: true })

        const existingVendor = await Vendor.findOne({ slug: updatedData.slug })
        if (existingVendor && existingVendor._id.toString() !== id) {
            const timestamp = Date.now()
            updatedData.slug = `${updatedData.slug}-${timestamp}`
        }
    }

    const updatedVendor = await Vendor.findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true,
    })

    if (!updatedVendor) {
        return next(new AppError(`No vendor found with that ID`, 404))
    }

    const cacheKeyOne = getCacheKey(Vendor.modelName, id)

    await redisClient.del(cacheKeyOne)
    await redisClient.setEx(cacheKeyOne, 3600, JSON.stringify(updatedVendor))

    const cacheKey = getCacheKey(Vendor.modelName, '', req.query)
    await redisClient.del(cacheKey)

    res.status(200).json({
        status: 'success',
        doc: updatedVendor,
    })
})

// Get all vendors
export const getAllVendors = getAll(Vendor, {
    path: 'totalProducts bank',
})

// Get vendor by ID
export const getVendorById = getOne(Vendor, {
    path: 'totalProducts bank',
})

// Define related models and their foreign keys
const relatedModels = [{ model: Product, foreignKey: 'userId' }]

// Delete vendor by ID
export const deleteVendor = deleteOneWithTransaction(Vendor, relatedModels)

// Update vendor status
export const updateVendorStatus = updateStatus(Vendor)
