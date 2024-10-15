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

const router = express.Router();

router
  .route("/")
  .post(validateSchema(businessGeneralValidationSchema), createBusinessGeneral)

  .get(getAllBusinessGeneral);

router
  .route("/:id")
  .get(getBusinessGeneralById)
  .put(updateBusinessGeneralById)
  .delete(deleteBusinessGeneralById);

export default router;
