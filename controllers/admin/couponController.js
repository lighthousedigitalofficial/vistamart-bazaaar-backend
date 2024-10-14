import Coupon from './../../models/admin/couponModel.js'

import {
    getAll,
    getOne,
    updateOne,
    updateStatus,
    deleteOne,
    createOne,
} from '../../factory/handleFactory.js'

// Create a new coupon
export const createCoupon = createOne(Coupon)

// Get all coupons
export const getAllCoupons = getAll(Coupon)

// Get a single coupon
export const getCouponById = getOne(Coupon)

// Update a coupon by ID
export const updateCoupon = updateOne(Coupon)

// Update coupon status by ID
export const updateCouponStatus = updateStatus(Coupon)

// Delete a coupon by ID
export const deleteCoupon = deleteOne(Coupon)
