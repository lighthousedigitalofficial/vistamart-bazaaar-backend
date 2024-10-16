import mongoose from 'mongoose'
import Product from '../../models/sellers/productModel.js'
import Vendor from '../../models/sellers/vendorModel.js'
import User from '../../models/admin/employeeModel.js'
import Color from './../../models/admin/colorModel.js'
import catchAsync from '../../utils/catchAsync.js'
import Attribute from '../../models/admin/attributeModel.js'
import {
    deleteOneWithTransaction,
    getAll,
    getOne,
    getOneBySlug,
    updateStatus,
    deleteOne,
} from '../../factory/handleFactory.js'
import { getCacheKey } from '../../utils/helpers.js'
import redisClient from '../../config/redisConfig.js'
import slugify from 'slugify'
import AppError from '../../utils/appError.js'
import Wishlist from '../../models/users/wishlistModel.js'
import Brand from '../../models/admin/brandModel.js'
import Category from '../../models/admin/categories/categoryModel.js'
import SubCategory from '../../models/admin/categories/subCategoryModel.js'
import SubSubCategory from '../../models/admin/categories/subSubCategoryModel.js'
// Create a new product
export const createProduct = catchAsync(async (req, res, next) => {
    let {
        name,
        description,
        category,
        subCategory,
        subSubCategory,
        brand,
        productType,
        digitalProductType,
        sku,
        unit,
        tags,
        price,
        discount,
        discountType,
        discountAmount,
        taxAmount,
        taxIncluded,
        minimumOrderQty,
        shippingCost,
        stock,
        isFeatured,
        colors,
        images,
        attributePrices = [],
        videoLink,
        userId,
        userType,
        metaTitle,
        metaDescription,
    } = req.body

    let user

    if (userType === 'vendor') {
        user = await Vendor.findById(userId)
        if (!user) {
            return next(new AppError('Referenced vendor does not exist', 400))
        }
    } else if (userType === 'in-house') {
        user = await User.findById(userId)
        if (!user) {
            return next(new AppError('Referenced user does not exist', 400))
        }
    } else {
        return next(new AppError('Invalid userType provided', 400))
    }

    const existingProduct = await Product.findOne({
        name,
        'attributePrices.attribute': {
            $in: attributePrices.map((attrPrice) => attrPrice.attribute),
        },
    })

    if (existingProduct) {
        return next(
            new AppError(
                'Product with the same name and attribute already exists',
                400
            )
        )
    }

    const newProduct = new Product({
        name,
        description,
        category,
        subCategory,
        subSubCategory,
        brand,
        productType,
        digitalProductType,
        sku,
        unit,
        tags,
        price,
        discount,
        discountType,
        discountAmount,
        taxAmount,
        taxIncluded,
        minimumOrderQty,
        shippingCost,
        stock,
        images,
        isFeatured: isFeatured || false,
        colors,
        attributes: attributePrices,
        videoLink,
        userId,
        userType,
        metaTitle,
        metaDescription,
        slug: slugify(name, { lower: true }),
    })

    await newProduct.save()

    const cacheKeyOne = getCacheKey('Product', newProduct._id)
    await redisClient.setEx(cacheKeyOne, 3600, JSON.stringify(newProduct))

    const cacheKey = getCacheKey('Product', '', req.query)
    await redisClient.del(cacheKey)

    res.status(201).json({
        status: 'success',
        doc: newProduct,
    })
})

export const updateProductImages = catchAsync(async (req, res) => {
    const productId = req.params.id
    const product = await Product.findById(productId)

    // Handle case where the document was not found
    if (!product) {
        return next(new AppError('No product found with that ID', 404))
    }

    product.images = req.files ? req.files.map((file) => file.path) : []
    await product.save()

    const cacheKeyOne = getCacheKey(Product, req.params.id)

    // delete pervious document data
    await redisClient.del(cacheKeyOne)
    // updated the cache with new data
    await redisClient.setEx(cacheKeyOne, 3600, JSON.stringify(doc))

    // Update cache
    const cacheKey = getCacheKey(Product, '', req.query)
    await redisClient.del(cacheKey)

    res.status(200).json({
        status: 'success',
        doc: product,
    })
})

export const getAllProducts = getAll(Product)

export const getProductById = getOne(Product, {
    path: 'reviews totalOrders',
})

export const getProductBySlug = getOneBySlug(Product, {
    path: 'reviews  totalOrders',
})

const relatedModels = [{ model: Wishlist, foreignKey: 'products' }]

// Delete a Product
export const deleteProduct = deleteOne(Product)

// Update product status
export const updateProductStatus = updateStatus(Product)

// Update product featured status
export const updateProductFeaturedStatus = catchAsync(
    async (req, res, next) => {
        const productId = req.params.id
        const { isFeatured } = req.body

        const product = await Product.findById(productId)
        if (!product) {
            return next(new AppError('No product found', 404))
        }

        product.isFeatured = isFeatured
        await product.save()

        // Update cache
        const cacheKey = getCacheKey('Product', '', req.query)
        await redisClient.del(cacheKey)

        res.status(200).json({
            status: 'success',
            doc: product,
        })
    }
)

// Mark product as sold
export const sellProduct = catchAsync(async (req, res) => {
    const productId = req.params.id

    const product = await Product.findById(productId)

    if (!product) {
        return next(new AppError('No product found with that ID.', 404))
    }

    product.status = 'sold'

    res.status(200).json({
        status: 'success',
        doc: product,
    })
})

// Update product details
export const updateProduct = catchAsync(async (req, res, next) => {
    const productId = req.params.id

    const {
        name,
        description,
        category,
        subCategory,
        subSubCategory,
        brand,
        productType,
        digitalProductType,
        sku,
        unit,
        tags,
        price, // Base price or default price if no attribute price
        discount,
        discountType,
        discountAmount,
        taxAmount,
        taxIncluded,
        minimumOrderQty,
        shippingCost,
        stock,
        isFeatured,
        colors,
        attributes, // Assuming attributes like 'small', 'medium', 'large'
        size,
        videoLink,
        userId,
        userType,
    } = req.body

    // Initialize discount calculation
    let updatedDiscountAmount = discountAmount

    // Calculate discount if needed
    if (discountType === 'flat') {
        updatedDiscountAmount = discountAmount
    } else if (discountType === 'percent') {
        updatedDiscountAmount = (price * discount) / 100
    }

    // Fetch prices based on selected attributes (e.g., size or color)
    let finalPrice = price // Start with the base price

    if (attributes && attributes.length > 0) {
        const attributePricePromises = attributes.map(async (attributeId) => {
            // Fetch attribute from the Attribute model (from another DB)
            const attribute = await adminDbConnection
                .model('Attribute')
                .findById(attributeId)
            if (!attribute) {
                return next(new AppError('Invalid attribute selected', 400))
            }
            // Assume attribute has a priceModifier field to adjust the price
            return attribute.priceModifier || 0
        })

        const attributePriceModifiers = await Promise.all(
            attributePricePromises
        )

        // Sum all the attribute-based price modifiers to get the final price
        finalPrice =
            price +
            attributePriceModifiers.reduce(
                (total, modifier) => total + modifier,
                0
            )
    }

    // Update the product with new values and calculated final price
    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
            name,
            description,
            category,
            subCategory,
            subSubCategory,
            brand,
            productType,
            digitalProductType,
            sku,
            unit,
            tags,
            price: finalPrice, // Set the updated final price
            discount,
            discountType,
            discountAmount: updatedDiscountAmount,
            taxAmount,
            taxIncluded,
            minimumOrderQty,
            shippingCost,
            stock,
            isFeatured,
            colors: [colors],
            attributes: [attributes], // Store attribute IDs
            size,
            videoLink,
            userId,
            userType,
            status: 'pending', // Reset status after update
            slug: slugify(name, { lower: true }),
        },
        { new: true }
    )

    // Update cache for the product
    const cacheKeyOne = getCacheKey('Product', updatedProduct?._id)
    await redisClient.setEx(cacheKeyOne, 3600, JSON.stringify(updatedProduct))

    // Invalidate product list cache
    const cacheKey = getCacheKey('Product', '', req.query)
    await redisClient.del(cacheKey)

    res.status(200).json({
        status: 'success',
        doc: updatedProduct,
    })
})
