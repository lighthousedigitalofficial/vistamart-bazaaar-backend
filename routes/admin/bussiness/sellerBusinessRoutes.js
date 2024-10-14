import express from "express";
import {
  createSellerBusiness,
  deleteSellerBusinessById,
  getAllSellerBusiness,
  getSellerBusinessById,
  updateSellerBusinessById,
} from "../../../controllers/admin/business/sellerBusinessController.js";

import { validateSchema } from "../../../middleware/validationMiddleware.js";
import sellerBusinessValidationSchema from "./../../../validations/admin/business/sellerBusinessValidator.js";

const router = express.Router();

router
  .route("/")
  .post(validateSchema(sellerBusinessValidationSchema), createSellerBusiness)

  .get(getAllSellerBusiness);

router
  .route("/:id")
  .get(getSellerBusinessById)
  .put(updateSellerBusinessById)
  .delete(deleteSellerBusinessById);

export default router;
