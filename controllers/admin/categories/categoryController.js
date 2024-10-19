import Category from '../../../models/admin/categories/categoryModel.js'
import slugify from 'slugify'
import {
    deleteOne,
    deleteOneWithTransaction,
    getAll,
    getOne,
    getOneBySlug,
    updateOne,
    updateStatus,
} from '../../../factory/handleFactory.js'

import catchAsync from '../../../utils/catchAsync.js'
import { getCacheKey } from '../../../utils/helpers.js'
import redisClient from '../../../config/redisConfig.js'

import SubCategory from '../../../models/admin/categories/subCategoryModel.js'
import SubSubCategory from '../../../models/admin/categories/subSubCategoryModel.js'
import Product from './../../../models/sellers/productModel.js'
import Order from '../../../models/transactions/orderModel.js'

// Create a new category
export const createCategory = catchAsync(async (req, res) => {
    const { name, priority, logo } = req.body

    const slug = slugify(name, { lower: true })

    const category = new Category({ name, logo, priority, slug })
    await category.save()

    if (!category) {
        return res.status(400).json({
            status: 'fail',
            message: `Category could not be created`,
        })
    }

    const cacheKeyOne = getCacheKey('Category', category?._id)
    await redisClient.setEx(cacheKeyOne, 3600, JSON.stringify(category))

    // delete all documents caches related to this model
    const cacheKey = getCacheKey('Category', '', req.query)
    await redisClient.del(cacheKey)

    res.status(201).json({
        status: 'success',
        doc: category,
    })
})

// export const getCategories = getAll(Category, {
//     path: [
//         'productCount',
//         {
//             path: 'subCategories',
//             select: '_id name slug',
//         },
//         {
//             path: 'subSubCategories',
//             select: '_id name slug',
//         },
//     ],
// })

// Get a single category by ID

export const getCategories = getAll(Category)

export const getCategoryById = catchAsync(async (req, res, next) => {
    const categoryId = req.params.id
    const cacheKey = getCacheKey('Category', categoryId)

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
    let doc = await Category.findById(categoryId).lean()

    if (!doc) {
        return next(new AppError(`No category found with that ID`, 404))
    }

    // Step 1: Fetch total products for the categor
    const totalProducts = await Product.countDocuments({
        categor: categoryId, // Match products with the given categor ID
    }).lean()

    // Step 2: Fetch all product IDs for the categor
    const products = await Product.find({
        category: categoryId,
    })
        .select('_id')
        .lean()

    // Extract product IDs from the products
    const productIds = products.map((product) => product._id)

    // Step 3: Fetch total orders that contain these products
    const totalOrders = await Order.countDocuments({
        products: { $in: productIds }, // Match orders that contain any of the product IDs
    }).lean()

    doc = {
        ...doc,
        totalProducts,
        totalOrders,
    }

    // Cache the result
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(doc))

    res.status(200).json({
        status: 'success',
        cached: false,
        doc,
    })
})

// Update a category by ID
export const updateCategory = updateOne(Category)
// Delete a category by ID
// Define related models and their foreign keys
const relatedModels = [
    { model: SubCategory, foreignKey: 'mainCategory' },
    { model: SubSubCategory, foreignKey: 'mainCategory' },
    // { model: Product, foreignKey: 'category' },
]

// Delete a category by ID
// export const deleteCategory = deleteOneWithTransaction(Category, relatedModels);
export const deleteCategory = deleteOne(Category)

// Get category by slug
export const getCategoryBySlug = getOneBySlug(Category)

export const updateCategoryStatus = updateStatus(Category)
