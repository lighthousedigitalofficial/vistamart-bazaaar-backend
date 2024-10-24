import express from "express";
import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
  updateCustomerStatus,
} from "./../../controllers/users/customerController.js";
import {
  logout,
  loginCustomer,
  signupCustomer,
  updatePassword,
  forgotPassword,
  resetPassword,
} from "../../controllers/authController.js";
import {
  protect,
  restrictTo,
  selectModelByRole,
} from "../../middleware/authMiddleware.js";
import { validateSchema } from "../../middleware/validationMiddleware.js";
import customerValidationSchema from "./../../validations/customerValidator.js";
// import { loginLimiter } from '../../utils/helpers.js'

const router = express.Router();

router.post("/login", loginCustomer);
router.post(
  "/register",
  validateSchema(customerValidationSchema),
  signupCustomer
);
router.post("/logout", protect, logout);

router.put("/update-password", protect, selectModelByRole, updatePassword);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

router
  .route("/")
  .post(
    protect,
    restrictTo("admin"),
    validateSchema(customerValidationSchema),
    createCustomer
  )
  //   .get(
  //     protect,
  //     restrictTo('admin', 'vendor'),
  //     getCustomers
  //   );

  .get(getCustomers);
router.put("/status/:id", protect, restrictTo("admin"), updateCustomerStatus);

router
  .route("/:id")
  .get(getCustomer)
  .put(protect, restrictTo("admin", "customer"), updateCustomer)
  .delete(protect, restrictTo("admin", "customer"), deleteCustomer);

export default router;
