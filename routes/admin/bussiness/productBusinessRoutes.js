import express from "express";
import {
  createProductBusiness,
  deleteProductBusinessById,
  getAllProductBusiness,
  updateProductBusinessById,
} from "../../../controllers/admin/business/productBusinessController.js";

import { validateSchema } from "../../../middleware/validationMiddleware.js";
import productBusinessValidationSchema from "./../../../validations/admin/business/productBusinessValidator.js";
import { getProductBusinessById } from "./../../../controllers/admin/business/productBusinessController.js";

const router = express.Router();

router
  .route("/")
  .post(validateSchema(productBusinessValidationSchema), createProductBusiness)

  .get(getAllProductBusiness);

router
  .route("/:id")
  .get(getProductBusinessById)
  .put(updateProductBusinessById)
  .delete(deleteProductBusinessById);

export default router;
