import express from "express";

// import flashDeal from './flashDealRoutes.js'
// import dealOfDay from './dealOfTheDayRoutes.js'
// import featureddeal from './featuredDealRoutes.js'

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
// import notification from './notificationRoutes.js'

import couponRoutes from './couponRoutes.js'
import colorRoutes from './colorRoutes.js'
import bannerRoutes from './bannerRoutes.js'
import attributeRoutes from './attributeRoutes.js'
import employeeRoutes from './employeeRoutes.js'
import roleRoutes from './roleRoutes.js'
import categoryRoutes from './categories/categoryRoutes.js'
import subCategoryRoutes from './categories/subCategoryRoutes.js'
import subSubCategoryRoutes from './categories/subSubCategoryRoutes.js'

import employeeRoutes from "./employeeRoutes.js";
import roleRoutes from "./roleRoutes.js";

const router = express.Router();

router.use('/employees', employeeRoutes)
router.use('/roles', roleRoutes)

router.use('/categories', categoryRoutes)
router.use('/sub-categories', subCategoryRoutes)
router.use('/sub-sub-categories', subSubCategoryRoutes)

router.use('/attributes', attributeRoutes)
router.use('/banners', bannerRoutes)
router.use('/colors', colorRoutes)
router.use('/coupons', couponRoutes)
router.use('/brands', brandsRoutes)

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
