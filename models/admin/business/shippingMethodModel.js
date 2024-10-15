import mongoose from 'mongoose';
import AppError from '../../../utils/appError.js'; 
import { adminDbConnection } from '../../../config/dbConnections.js';

const shippingMethodSchema = new mongoose.Schema(
  {
    shippingResponsibility: {
      type: String,
      enum: ['Inhouse shipping', 'Seller wise shipping'],
      default: 'Inhouse shipping',
      required: [true, 'Please specify the shipping responsibility'],
    },
    shippingMethodForInhouseDelivery: {
      type: String,
      required: [
        true,
        'Please provide the shipping method for in-house delivery',
      ],
      enum: ['categoryWise', 'orderWise'], 
    },
    
    orderWise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderWise',
    },
    categoryWise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CategoryWise',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// Example virtual field (if you need to add any specific calculations)
shippingMethodSchema.virtual('fullDetails').get(function () {
  return `${this.shippingResponsibility} - ${this.shippingMethodForInhouseDelivery}`;
});

// Pre-save hook to validate the references
shippingMethodSchema.pre('save', async function (next) {
  try {
    // Validate orderWise reference if it exists
    if (this.orderWise) {
      const orderWiseExists = await adminDbConnection
        .model('OrderWise')
        .countDocuments({ _id: this.orderWise });

      if (orderWiseExists === 0) {
        return next(new AppError('The referenced OrderWise does not exist.', 400));
      }
    }

    // Validate categoryWise reference if it exists
    if (this.categoryWise) {
      const categoryWiseExists = await adminDbConnection
        .model('CategoryWise')
        .countDocuments({ _id: this.categoryWise });

      if (categoryWiseExists === 0) {
        return next(new AppError('The referenced CategoryWise does not exist.', 400));
      }
    }

    next();
  } catch (err) {
    next(err);
  }
});

// Pre-find hook to populate references
shippingMethodSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'orderWise',
    select: 'title cost duration status', 
  }).populate({
    path: 'categoryWise',
    select: 'categoryName costPerProduct status',
  });
  next();
});

const ShippingMethod = adminDbConnection.model('ShippingMethod', shippingMethodSchema);

export default ShippingMethod;
