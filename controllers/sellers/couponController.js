import Coupon from "../../models/sellers/couponModel.js";
import Customer from "../../models/users/customerModel.js";

import {
  getAll,
  getOne,
  updateOne,
  updateStatus,
  deleteOne,
  createOne,
} from "../../factory/handleFactory.js";

// Create a new coupon
export const createCoupon = createOne(Coupon);

// Get all coupons
// export const getAllCoupons = getAll(Coupon);
// Controller for getting all coupons with vendor and customer details

// Get all coupons

import redisClient from "../../config/redisConfig.js"; 
import catchAsync from "../../utils/catchAsync.js"; 
import APIFeatures from "../../utils/apiFeatures.js"; 
import { getCacheKey } from "../../utils/helpers.js"; 

export const getAllCoupons = catchAsync(async (req, res, next) => {
  const cacheKey = getCacheKey("Coupon", "", req.query);

  // Check cache first
  const cachedDoc = await redisClient.get(cacheKey);

  if (cachedDoc !== null) {
    return res.status(200).json({
      status: "success",
      cached: true,
      results: JSON.parse(cachedDoc).length,
      data: {
        coupons: JSON.parse(cachedDoc),
      },
    });
  }

  // If not in cache, fetch from database
  let query = Coupon.find();

  const features = new APIFeatures(query, req.query)
    .filter() // Include any filtering logic here
    .sort() // Include sorting logic here
    .fieldsLimit() // Include field limiting logic here
    .paginate(); // Include pagination logic here

  const doc = await features.query;

  // Cache the result
  await redisClient.setEx(cacheKey, 3600, JSON.stringify(doc));

  res.status(200).json({
    status: "success",
    cached: false,
    results: doc.length,
    doc: {
      coupons: doc,
    },
  });
});

// Get a single coupon
export const getCouponById = getOne(Coupon);

// Update a coupon by ID
export const updateCoupon = updateOne(Coupon);

// Update coupon status by ID
export const updateCouponStatus = updateStatus(Coupon);

// Delete a coupon by ID
export const deleteCoupon = deleteOne(Coupon);
