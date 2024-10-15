import mongoose from "mongoose";
import AppError from "../../utils/appError.js";
import {
      sellerDbConnection,
} from "../../config/dbConnections.js";
import Brand from "../admin/brandModel.js";
import Category from "../admin/categories/categoryModel.js";
import SubCategory from "../admin/categories/subCategoryModel.js";
import SubSubCategory from "../admin/categories/subSubCategoryModel.js";
const productSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, 'Please provide Product name'],
        trim: true,
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
      },
      discount: {
        type: Number,
        default: 0,
      },
      discountType: {
        type: String,
        enum: ['percent', 'flat'],
      },
      discountAmount: {
        type: Number,
        default: 0,
      },
      taxAmount: {
        type: Number,
        default: 0,
      },
      taxIncluded: {
        type: Boolean,
      },
      shippingCost: {
        type: Number,
        default: 0,
      },
      minimumOrderQty: {
        type: Number,
        required: [true, 'Please provide Minimum order quantity'],
      },
      stock: {
        type: Number,
        required: [true, 'Please provide Stock'],
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
      attributePrices: [
        {
          attribute: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Attribute',
          },
          price: {
            type: Number,
          },
        },
      ],
      thumbnail: String,
      images: [String],
      videoLink: {
        type: String,
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please provide user.'],
      },
      userType: {
        type: String,
        enum: ['vendor', 'admin'],
 
      },
      slug: String,
      rating: {
        type: Number,
        default: 0,
        set: val => Math.round(val * 10) / 10,
      },
      numOfReviews: {
        type: Number,
        default: 0,
      },
    },
    {
    //   toJSON: { virtuals: true },
    //   toObject: { virtuals: true },
      timestamps: true,
    }
  );

// productSchema.pre("save", async function (next) {
//   if (this.category) {
//     const category = await Category.findById(this.category);
//     if (!category) {
//       return next(new AppError("Referenced category ID does not exist", 400));
//     }
//   }

//   if (this.subCategory) {
//     const subCategory = await SubCategory.findById(this.subCategory);

//     if (!subCategory) {
//       return next(
//         new AppError("Referenced subCategory ID does not exist", 400)
//       );
//     }
//   }

//   if (this.subSubCategory) {
//     const subSubCategory = await SubSubCategory.findById(this.subSubCategory);

//     if (!subSubCategory) {
//       return next(
//         new AppError("Referenced subSubCategory ID does not exist", 400)
//       );
//     }
//   }

//   const brand = await Brand.findById(this.brand);
//   if (!brand) {
//     return next(new AppError("Referenced brand ID does not exist", 400));
//   }
//   next();
// });

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


productSchema.post("findByIdAndDelete", async function (doc) {
  if (doc) {
    await mongoose.model("Review").deleteMany({ product: doc._id });
  }
});

const Product = sellerDbConnection.model("Product", productSchema);

export default Product;
