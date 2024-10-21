import Category from "../../../models/admin/categories/categoryModel.js";
import slugify from "slugify";
import {
  deleteOne,
  deleteOneWithTransaction,
  getAll,
  getOne,
  getOneBySlug,
  updateOne,
  updateStatus,
} from "../../../factory/handleFactory.js";

import catchAsync from "../../../utils/catchAsync.js";
import { getCacheKey } from "../../../utils/helpers.js";
import redisClient from "../../../config/redisConfig.js";

import SubCategory from "../../../models/admin/categories/subCategoryModel.js";
import SubSubCategory from "../../../models/admin/categories/subSubCategoryModel.js";
import Product from "./../../../models/sellers/productModel.js";

// Create a new category
export const createCategory = catchAsync(async (req, res) => {
  const { name, priority, logo } = req.body;

  const slug = slugify(name, { lower: true });

  const category = new Category({ name, logo, priority, slug });
  await category.save();

  if (!category) {
    return res.status(400).json({
      status: "fail",
      message: `Category could not be created`,
    });
  }

  const cacheKeyOne = getCacheKey("Category", category?._id);
  await redisClient.setEx(cacheKeyOne, 3600, JSON.stringify(category));

  // delete all documents caches related to this model
  const cacheKey = getCacheKey("Category", "", req.query);
  await redisClient.del(cacheKey);

  res.status(201).json({
    status: "success",
    doc: category,
  });
});

// Get a single category by ID

export const getCategories = getAll(Category);

export const getCategoryById = getOne(Category);

// Update a category by ID
export const updateCategory = updateOne(Category);
// Delete a category by ID
const relatedModels = [
  { model: SubCategory, foreignKey: "mainCategory" },
  { model: SubSubCategory, foreignKey: "mainCategory" },
  // { model: Product, foreignKey: 'category' },
];

// DELETE Category and Related Products
// export const deleteCategoryWithProducts = catchAsync(async (req, res, next) => {
//   const { id } = req.params;

//   // Find the category by ID to ensure it exists
//   const deletedCategory = await Category.findByIdAndDelete(id);

//   // Check if the category was found and deleted
//   if (!deletedCategory) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Category not found",
//     });
//   }

//   // Delete all products related to the deleted category
//   const deletedProducts = await Product.deleteMany({ category: id });

//   return res.status(200).json({
//     status: "success",
//     message: "Category and related products deleted successfully",
//     doc: {
//       deletedCategory,
//       deletedProductsCount: deletedProducts.deletedCount,
//     },
//   });
// });

// DELETE Category and Related Products
export const deleteCategoryWithProducts = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Find and delete the category by ID
  const deletedCategory = await Category.findByIdAndDelete(id);

  // Check if the category was found and deleted
  if (!deletedCategory) {
    return res.status(404).json({
      status: "fail",
      message: "Category not found",
    });
  }

  // Delete all products related to the deleted category
  const deletedProducts = await Product.deleteMany({ category: id });

  // Clear the category cache (single and multiple document caches)
  const cacheKeyOne = getCacheKey(Category.Category, id);
  await redisClient.del(cacheKeyOne);

  // Clear the cache for the products related to the category
  const cacheKey = getCacheKey(Product.Product, "", { category: id });
  await redisClient.del(cacheKey);

  // Return success response
  return res.status(200).json({
    status: "success",
    message: "Category and related products deleted successfully",
  });
});

// Get category by slug
export const getCategoryBySlug = getOneBySlug(Category);

export const updateCategoryStatus = updateStatus(Category);
