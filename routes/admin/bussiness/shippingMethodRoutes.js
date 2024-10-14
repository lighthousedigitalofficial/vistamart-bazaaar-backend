import express from "express";
import {
  createShippingMethod,
  deleteShippingMethodById,
  getAllShippingMethod,
  getShippingMethodById,
  updateShippingMethodById,
} from "../../../controllers/admin/business/shippingMethodController.js";

import { validateSchema } from "../../../middleware/validationMiddleware.js";
import shippingMethodValidationSchema from "./../../../validations/admin/business/shippingMethodValidator.js";

const router = express.Router();

router
  .route("/")
  .post(validateSchema(shippingMethodValidationSchema), createShippingMethod)

  .get(getAllShippingMethod);

router
  .route("/:id")
  .get(getShippingMethodById)
  .put(updateShippingMethodById)
  .delete(deleteShippingMethodById);

export default router;
