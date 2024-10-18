import express from "express";

import {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
  updateBrandStatus,
  getBrandBySlug,
} from "./../../controllers/admin/brandController.js";
import { protect, restrictTo } from "./../../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  // .post(protect, restrictTo('admin'), createBrand)
  .post(createBrand)
  .get(getBrands);

router
  .route("/:id")
  .get(getBrandById)
  .put(protect, restrictTo("admin"), updateBrand)
  .delete(protect, restrictTo("admin"), deleteBrand);

router
  .route("/status/:id")
  .put(protect, restrictTo("admin"), updateBrandStatus);

router.get("/slug/:slug", getBrandBySlug);

export default router;
