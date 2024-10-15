import mongoose from 'mongoose';
import { checkReferenceId } from '../../utils/helpers.js';
import { sellerDbConnection } from '../../config/dbConnections.js';

const vendorBankSchema = new mongoose.Schema({
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: [true, 'Please provide vendor ID.'],
        unique: true,
    },
    holderName: {
        type: String,
        required: [true, 'Please provide holder name.'],
        trim: true,
    },
    bankName: {
        type: String,
        required: [true, 'Please provide bank name.'],
        trim: true,
    },
    branch: {
        type: String,
        required: [true, 'Please provide branch name.'],
        trim: true,
    },
    accountNumber: {
        type: String,
        required: [true, 'Please provide account number.'],
        unique: true,
        trim: true,
    },
}, {
    timestamps: true,
});

// Pre-save hook to check if the vendor exists before saving
vendorBankSchema.pre('save', async function (next) {
    try {
        const exists = await checkReferenceId('Vendor', this.vendor);
        if (!exists) {
            return next(new Error('Vendor ID does not exist.'));
        }
        next();
    } catch (err) {
        console.error('Error during vendor existence check:', err);
        return next(err);
    }
});

// Export the model
export default sellerDbConnection.model('VendorBank', vendorBankSchema);
