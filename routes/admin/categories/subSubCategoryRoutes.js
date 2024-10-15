import express from "express";

import {
  createSubSubCategory,
  getAllSubSubCategories,
  getSubSubCategoryById,
  getSubSubCategoryBySlug,
  updateSubSubCategoryById,
  deleteSubSubCategoryById,
} from "./../../../controllers/admin/categories/subSubCategoryController.js";

import { validateSchema } from "../../../middleware/validationMiddleware.js";
import subSubCategoryValidationSchema from "./../../../validations/admin/categories/subSubCategoryValidator.js";
import { protect, restrictTo } from "./../../../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(
    // protect,
    // restrictTo("admin"),
    validateSchema(subSubCategoryValidationSchema),
    createSubSubCategory
  )
  .get(getAllSubSubCategories);

router
  .route("/:id")
  .get(getSubSubCategoryById)
  .put(updateSubSubCategoryById)
  .delete(deleteSubSubCategoryById);
//   .put(protect, restrictTo("admin"), updateSubSubCategoryById)
//   .delete(protect, restrictTo("admin"), deleteSubSubCategoryById);

router.route("/slug/:slug").get(getSubSubCategoryBySlug);

export default router;
