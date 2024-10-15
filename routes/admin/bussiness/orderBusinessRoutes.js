import express from "express";
import {
  createOrderBusiness,
  deleteOrderBusinessById,
  getAllOrderBusiness,
  getOrderBusinessById,
  updateOrderBusinessById,
} from "../../../controllers/admin/business/orderBusinessController.js";

import { validateSchema } from "../../../middleware/validationMiddleware.js";
import orderBusinessValidationSchema from "./../../../validations/admin/business/orderBusinessValidator.js";

const router = express.Router();

router
  .route("/")
  .post(validateSchema(orderBusinessValidationSchema), createOrderBusiness)

  .get(getAllOrderBusiness);

router
  .route("/:id")
  .get(getOrderBusinessById)
  .put(updateOrderBusinessById)
  .delete(deleteOrderBusinessById);

export default router;
