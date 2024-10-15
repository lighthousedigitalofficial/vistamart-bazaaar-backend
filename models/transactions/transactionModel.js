import mongoose from 'mongoose';
import { transactionDbConnection } from '../../config/dbConnections.js'
const transactionSchema = new mongoose.Schema({
    discountedAmount: {
        type: Number,
        required: [true, "'Discounted Amount' is required"],
        default: 0,
    },
    vatOrTax: {
        type: Number,
        required: [true, "'VAT/TAX' is required"],
        default: 0,
    },
    shippingCharge: {
        type: Number,
        required: [true, "'Shipping Charge' is required"],
        default: 0,
    },
    orderAmount: {
        type: Number,
        required: [true, "'Order Amount' is required"],
        default: 0,
    },
    deliveredBy: {
        type: String,
        trim: true,
        required: [true, "'Delivered By' is required"],
    },
    deliverymanIncentive: {
        type: Number,
        default: 0,
    },
    adminDiscount: {
        type: Number,
        default: 0,
    },
    vendorDiscount: {
        type: Number,
        default: 0,
    },
    adminCommission: {
        type: Number,
        required: [true, "'Admin Commission' is required"],
        default: 0,
    },
    adminNetIncome: {
        type: Number,
        required: [true, "'Admin Net Income' is required"],
        default: 0,
    },
    vendorNetIncome: {
        type: Number,
        required: [true, "'Vendor Net Income' is required"],
        default: 0,
    },
    paymentMethod: {
        type: String,
        trim: true,
        required: [true, "'Payment Method' is required"],
        enum: {
            values: ['Cash', 'Digital', 'Wallet', 'Offline'],
            message: "'Payment Method' must be either 'Cash', 'Digital', 'Wallet', or 'Offline'",
        },
    },
    paymentStatus: {
        type: String,
        trim: true,
        required: [true, "'Payment Status' is required"],
        enum: {
            values: ['Completed', 'Pending', 'Failed'],
            message: "'Payment Status' must be either 'Completed', 'Pending', or 'Failed'",
        },
    },
    action: {
        type: String,
        trim: true,
        default: '',
    },
    totalOrders: {
        type: Number,
        required: [true, "'Total Orders' is required"],
        default: 0,
    },
    inHouseOrders: {
        type: Number,
        required: [true, "'In House Orders' is required"],
        default: 0,
    },
    vendorOrders: {
        type: Number,
        required: [true, "'Vendor Orders' is required"],
        default: 0,
    },
    totalProducts: {
        type: Number,
        required: [true, "'Total Products' is required"],
        default: 0,
    },
    inHouseProducts: {
        type: Number,
        required: [true, "'In House Products' is required"],
        default: 0,
    },
    vendorProducts: {
        type: Number,
        required: [true, "'Vendor Products' is required"],
        default: 0,
    },
    totalStores: {
        type: Number,
        required: [true, "'Total Stores' is required"],
        default: 0,
    },
    totalTransactions: {
        type: Number,
        required: [true, "'Total Transactions' is required"],
        default: 0,
    },
    paymentStatistics: {
        type: String,
        enum: ['completedPayments', 'cashPayments', 'digitalPayments', 'walletPayments', 'offlinePayments'],
        message: "'Payment Statistics' must be one of the defined values",
    },
}, {
    timestamps: true,
});

const Transaction = transactionDbConnection.model('Transaction', transactionSchema);
export default Transaction;
