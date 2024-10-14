import express from "express";

// import productRoutes from './productRoutes.js'
// import colorRoutes from './colorRoutes.js'
// import banner from './bannerRoutes.js'
// import flashDeal from './flashDealRoutes.js'
// import dealOfDay from './dealOfTheDayRoutes.js'
// import featureddeal from './featuredDealRoutes.js'
// import attributeRoutes from './attributeRoutes.js'
// import coupons from './couponRoutes.js'
// import subscriber from './subscriberRoutes.js'
// import notification from './notificationRoutes.js'

//Kiran
import categoryRoutes from "../../routes/admin/categories/categoryRoutes.js";
import subCategoryRoutes from "../../routes/admin/categories/subCategoryRoutes.js";
import subSubCategoryRoutes from "../../routes/admin/categories/subSubCategoryRoutes.js";
import brandsRoutes from "../../routes/admin/brandRoutes.js";
import businessGeneralRoutes from "./bussiness/businessGeneralRoutes.js";
import categoryWiseRoutes from "./bussiness/categoryWiseRoutes.js";
import customerBusinessRoutes from "./bussiness/customerBusinessRoutes.js";
import deliveryManRoutes from "./bussiness/deliveryManRoutes.js";
import deliveryRestrictionRoutes from "./bussiness/deliveryRestrictionRoutes.js";
import inHouseShopRotes from "./bussiness/inHouseShopRoutes.js";
import orderBusinessRoutes from "./bussiness/orderBusinessRoutes.js";
import orderWiseRoutes from "./bussiness/orderWiseRoutes.js";
import productBusinessRoutes from "./bussiness/productBusinessRoutes.js";
import sellerBusinessRoutes from "./bussiness/sellerBusinessRoutes.js";
import shippinpMethodRoutes from "./bussiness/shippingMethodRoutes.js";

//
import employeeRoutes from "./employeeRoutes.js";
import roleRoutes from "./roleRoutes.js";

const router = express.Router();

router.use("/employees", employeeRoutes);
router.use("/roles", roleRoutes);

// router.use('/products', productRoutes)
router.use("/brands", brandsRoutes);
router.use("/categories", categoryRoutes);
router.use("/sub-categories", subCategoryRoutes);
router.use("/sub-sub-categories", subSubCategoryRoutes);
// router.use('/attributes', attributeRoutes)
// router.use('/colors', colorRoutes)
// router.use('/banners', banner)
// router.use('/notifications', notification)
// router.use('/flash-deals', flashDeal)
// router.use('/deal-of-day', dealOfDay)
// router.use('/featured-deals', featureddeal)
// router.use('/coupons', coupons)
// router.use('/subscribers', subscriber)

//Business
router.use("/businessgeneral", businessGeneralRoutes);
router.use("/categorywise", categoryWiseRoutes);
router.use("/customerBusiness", customerBusinessRoutes);
router.use("/deliveryman", deliveryManRoutes);
router.use("/deliveryRestriction", deliveryRestrictionRoutes);
router.use("/inHouseShop", inHouseShopRotes);
router.use("/orderBusiness", orderBusinessRoutes);
router.use("/orderWise", orderWiseRoutes);
router.use("/productBusiness", productBusinessRoutes);
router.use("/sellerBusiness", sellerBusinessRoutes);
router.use("/shippinpMethod", shippinpMethodRoutes);

export default router;
