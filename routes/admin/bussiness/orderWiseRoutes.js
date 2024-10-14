import express from "express";
import {
  createOrderWise,
  deleteOrderWiseById,
  getAllOrderWise,
  getOrderWiseById,
  updateOrderWiseById,
} from "../../../controllers/admin/business/orderWiseController.js";

import { validateSchema } from "../../../middleware/validationMiddleware.js";
import orderWiseValidationSchema from "./../../../validations/admin/business/orderWiseValidator.js";

const router = express.Router();

router
  .route("/")
  .post(validateSchema(orderWiseValidationSchema), createOrderWise)

  .get(getAllOrderWise);

router
  .route("/:id")
  .get(getOrderWiseById)
  .put(updateOrderWiseById)
  .delete(deleteOrderWiseById);

export default router;
