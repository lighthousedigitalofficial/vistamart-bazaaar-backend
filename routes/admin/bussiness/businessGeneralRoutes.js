import express from "express";

import {
  createBusinessGeneral,
  deleteBusinessGeneralById,
  getAllBusinessGeneral,
  getBusinessGeneralById,
  updateBusinessGeneralById,
} from "./../../../controllers/admin/business/businessGeneralController.js";

import { validateSchema } from "../../../middleware/validationMiddleware.js";
import businessGeneralValidationSchema from "./../../../validations/admin/business/businessGeneralValidator.js";
import { protect, restrictTo } from "../../../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    restrictTo("admin"),
    validateSchema(businessGeneralValidationSchema),
    createBusinessGeneral
  )

  .get(getAllBusinessGeneral);

router
  .route("/:id")
  .get(getBusinessGeneralById)
  .put(protect, restrictTo("admin"), updateBusinessGeneralById)
  .delete(protect, restrictTo("admin"), deleteBusinessGeneralById);

export default router;
