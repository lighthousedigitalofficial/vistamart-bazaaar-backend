import mongoose from 'mongoose'
import AppError from '../../utils/appError.js'
import { sellerDbConnection } from '../../config/dbConnections.js'
import Brand from '../admin/brandModel.js'
import Category from '../admin/categories/categoryModel.js'
import SubCategory from '../admin/categories/subCategoryModel.js'
import SubSubCategory from '../admin/categories/subSubCategoryModel.js'
import Color from '../admin/colorModel.js'
import Attribute from '../admin/attributeModel.js'
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide Product name'],
            trim: true,
            maxlength: [100, 'Product name cannot exceed 100 characters'],
        },
        description: {
            type: String,
            required: [true, 'Please provide Product description'],
            trim: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Please provide Category'],
        },
        subCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubCategory',
        },
        subSubCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubSubCategory',
        },
        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Brand',
            required: [true, 'Please provide Brand'],
        },
        productType: {
            type: String,
            required: [true, 'Please provide Product type'],
        },
        digitalProductType: {
            type: String,
            enum: ['physical', 'digital'],
            default: 'physical',
        },
        sku: {
            type: String,
            required: [true, 'Please provide SKU'],
        },
        unit: {
            type: String,
            required: [true, 'Please provide Unit'],
        },
        tags: [String],
        price: {
            type: Number,
            min: [0, 'Price cannot be negative'],
        },
        discount: {
            type: Number,
            min: [0, 'Discount cannot be negative'],
            max: [100, 'Discount cannot exceed 100%'],
            default: 0,
        },
        discountType: {
            type: String,
            enum: ['percent', 'flat'],
        },
        discountAmount: {
            type: Number,
            min: [0, 'Discount amount cannot be negative'],
            default: 0,
        },
        taxAmount: {
            type: Number,
            min: [0, 'Tax amount cannot be negative'],
            default: 0,
        },
        taxIncluded: {
            type: Boolean,
            default: false,
        },
        shippingCost: {
            type: Number,
            min: [0, 'Shipping cost cannot be negative'],
            default: 0,
        },
        minimumOrderQty: {
            type: Number,
            required: [true, 'Please provide Minimum Order Quantity'],
            min: [1, 'Minimum order quantity must be at least 1'],
        },
        stock: {
            type: Number,
            required: [true, 'Please provide Stock quantity'],
            min: [0, 'Stock cannot be negative'],
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        colors: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Color',
            },
        ],
        attributes: [
            {
                attribute: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Attribute',
                    required: [true, 'Please provide Attribute ID'],
                },
                price: {
                    type: Number,
                    min: [0, 'Attribute price cannot be negative'],
                },
            },
        ],
        thumbnail: String,
        images: [String],
        videoLink: String,
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'userType',
            required: [true, 'Please provide Owner ID'],
        },
        userType: {
          type: String,
          enum: ['vendor', 'in-house'], 
          required: [true, 'Please provide Owner type'],
      },
        slug: String,
        rating: {
            type: Number,
            min: [0, 'Rating cannot be negative'],
            max: [5, 'Rating cannot exceed 5'],
            default: 0,
        },
        numOfReviews: {
            type: Number,
            min: [0, 'Number of reviews cannot be negative'],
            default: 0,
        },
        metaTitle: {
          type: String,
          maxlength: [60, 'Meta title cannot exceed 60 characters'],
      },
      metaDescription: {
          type: String,
          maxlength: [160, 'Meta description cannot exceed 160 characters'],
      },
    },
    { timestamps: true }
)

productSchema.pre('save', async function (next) {
    try {
        if (this.category) {
            const category = await Category.findById(this.category)
            if (!category) {
                return next(
                    new AppError('Referenced category ID does not exist', 400)
                )
            }
            this.category = category
        }

        if (this.subCategory) {
            const subCategory = await SubCategory.findById(this.subCategory)
            if (!subCategory) {
                return next(
                    new AppError(
                        'Referenced subCategory ID does not exist',
                        400
                    )
                )
            }
            this.subCategory = subCategory || null
        }

        if (this.subSubCategory) {
            const subSubCategory = await SubSubCategory.findById(
                this.subSubCategory
            )
            if (!subSubCategory) {
                return next(
                    new AppError(
                        'Referenced subSubCategory ID does not exist',
                        400
                    )
                )
            }
            this.subSubCategory = subSubCategory || null
        }

        const brand = await Brand.findById(this.brand)
        if (!brand) {
            return next(new AppError('Referenced brand ID does not exist', 400))
        }
        this.brand = brand

        if (this.colors && this.colors.length > 0) {
            const colorDocs = await Color.find({ _id: { $in: this.colors } })
            if (colorDocs.length !== this.colors.length) {
                return next(
                    new AppError(
                        'One or more provided colors do not exist',
                        400
                    )
                )
            }
            this.colors = colorDocs || []
        }

        if (this.attributes && this.attributes.length > 0) {
            const attributeIds = this.attributes.map((attr) => attr.attribute)
            const fetchedAttributes = await Attribute.find({
                _id: { $in: attributeIds },
            })

            if (fetchedAttributes.length !== attributeIds.length) {
                return next(
                    new AppError(
                        'One or more provided attributes do not exist',
                        400
                    )
                )
            }

            this.attributes = this.attributes.map((attrPrice) => {
                const attributeName = fetchedAttributes.find(
                    (attr) =>
                        attr._id.toString() === attrPrice.attribute.toString()
                )
                console.log(attributeName.name)
                return {
                    attribute: attributeName,
                    price: attrPrice.price,
                }
            })

            console.log(this.attributes)
        }

        next()
    } catch (error) {
        return next(error)
    }
})

// // Virtual middleware fetch all the reviews associated with this product
// productSchema.virtual("reviews", {
//   ref: "ProductReview",
//   localField: "_id",
//   foreignField: "product",
// });

// productSchema.virtual("totalOrders", {
//   ref: "Order",
//   localField: "_id",
//   foreignField: "products",
//   count: true,
// });

// productSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "category",
//     select: "name",
//   })
//     .populate({
//       path: "brand",
//       select: "name",
//     })
//         .populate({
//             path: 'brand',
//             select: 'name',
//         })
//         .populate({
//             path: 'subCategory',
//             select: 'name',
//         })
//         .populate({
//             path: 'subSubCategory',
//             select: 'name',
//         })
//         .populate({
//             path: 'attributePrices.attribute',
//             select: 'name',
//         })
//     next()
// })

productSchema.post('findByIdAndDelete', async function (doc) {
    if (doc) {
        await mongoose.model('Review').deleteMany({ product: doc._id })
    }
})

const Product = sellerDbConnection.model('Product', productSchema)

export default Product
