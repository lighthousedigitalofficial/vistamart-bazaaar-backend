import express from "express";
import {
  createCustomerBusiness,
  deleteCustomerBusinessById,
  getAllCustomerBusiness,
  getCustomerBusinessById,
  updateCustomerBusinessById,
} from "../../../controllers/admin/business/customerBusinessController.js";

import { validateSchema } from "../../../middleware/validationMiddleware.js";
import customerBusinessValidationSchema from "./../../../validations/admin/business/customerBusinessValidator.js";
const router = express.Router();

router
  .route("/")
  .post(
    validateSchema(customerBusinessValidationSchema),
    createCustomerBusiness
  )

  .get(getAllCustomerBusiness);

router
  .route("/:id")
  .get(getCustomerBusinessById)
  .put(updateCustomerBusinessById)
  .delete(deleteCustomerBusinessById);

export default router;
