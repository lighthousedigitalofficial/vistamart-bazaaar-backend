import express from "express";
import { createDeliveryMan, deleteDeliveryManById, getAllDeliveryMan, getDeliveryManById, updateDeliveryManById } from "../../../controllers/admin/business/deliveryManController.js";

import { validateSchema } from "../../../middleware/validationMiddleware.js";
import deliveryManValidationSchema from "./../../../validations/admin/business/deliveryManValidator.js";
const router = express.Router();

router
  .route("/")
  .post(
    validateSchema(deliveryManValidationSchema),
    createDeliveryMan
  )

  .get(getAllDeliveryMan);

router
  .route("/:id")
  .get(getDeliveryManById)
  .put(updateDeliveryManById)
  .delete(deleteDeliveryManById);

export default router;
