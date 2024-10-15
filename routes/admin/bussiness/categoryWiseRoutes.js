import express from "express";
import {
  createCategoryWise,
  deleteCategoryWiseById,
  getAllCategoryWise,
  getCategoryWiseById,
  updateCategoryWiseById,
} from "../../../controllers/admin/business/categoryWiseController.js";

import { validateSchema } from "../../../middleware/validationMiddleware.js";
import categoryWiseValidationSchema from "./../../../validations/admin/business/categoryWiseValidator.js";
const router = express.Router();

router
  .route("/")
  .post(validateSchema(categoryWiseValidationSchema), createCategoryWise)

  .get(getAllCategoryWise);

router
  .route("/:id")
  .get(getCategoryWiseById)
  .put(updateCategoryWiseById)
  .delete(deleteCategoryWiseById);

export default router;
