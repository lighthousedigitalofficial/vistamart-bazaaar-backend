import express from "express";
import {
  createInHouseShop,
  deleteInHouseShopById,
  getAllInHouseShop,
  getInHouseShopById,
  updateInHouseShopById,
} from "../../../controllers/admin/business/inHouseShopController.js";

import { validateSchema } from "../../../middleware/validationMiddleware.js";
import inHouseShopValidationSchema from "./../../../validations/admin/business/inHouseShopValidator.js";

const router = express.Router();

router
  .route("/")
  .post(validateSchema(inHouseShopValidationSchema), createInHouseShop)

  .get(getAllInHouseShop);

router
  .route("/:id")
  .get(getInHouseShopById)
  .put(updateInHouseShopById)
  .delete(deleteInHouseShopById);

export default router;
