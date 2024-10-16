import express from 'express';
import {
    registerVendor,
    updateVendorStatus,
    getAllVendors,
    getVendorById,
    deleteVendor,
    updateVendorWithSlug,
} from '../../controllers/sellers/vendorController.js';
import { validateSchema } from '../../middleware/validationMiddleware.js';
import vendorValidationSchema from '../../validations/admin/sellers/vendorValidator.js';
import { loginLimiter } from '../../utils/helpers.js';
// import { protect, restrictTo, selectModelByRole } from '../../middleware/authMiddleware.js';
import {
    loginVendor,
    logout,
    updatePassword,
} from '../../controllers/authController.js';

const router = express.Router();

// Vendor registration route
router.route('/signup')
    .post(validateSchema(vendorValidationSchema), registerVendor);

// Vendor login and logout routes
router.post('/login', loginLimiter, loginVendor);
router.post('/logout', /* protect, */ logout);

// Route to get all vendors
router.route('/')
    .get(getAllVendors);

// Routes for vendor by ID
router.route('/:id')
    .get(getVendorById) // Get vendor by ID
    .delete(/* protect, restrictTo('admin', 'vendor'), */ deleteVendor) // Delete vendor by ID
    .put(updateVendorWithSlug); // Update vendor by ID using PUT

// Other vendor-related routes
router.put('/update-password', /* protect, selectModelByRole, */ updatePassword);
router.put('/status/:id', /* protect, restrictTo('admin'), */ updateVendorStatus);

export default router;
