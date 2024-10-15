import express from "express";
import {
  createDeliveryRestriction,
  getAllDeliveryRestriction,
  updateDeliveryRestrictionById,
  getDeliveryRestrictionById,
  deleteDeliveryRestrictionById,
} from "../../../controllers/admin/business/deliveryRestrictionController.js";

import { validateSchema } from "../../../middleware/validationMiddleware.js";
import deliveryRestrictionValidationSchema from "./../../../validations/admin/business/deliveryRestrictionValidator.js";

const router = express.Router();

router
  .route("/")
  .post(
    validateSchema(deliveryRestrictionValidationSchema),
    createDeliveryRestriction
  )

  .get(getAllDeliveryRestriction);

router
  .route("/:id")
  .get(getDeliveryRestrictionById)
  .put(updateDeliveryRestrictionById)
  .delete(deleteDeliveryRestrictionById);

export default router;
