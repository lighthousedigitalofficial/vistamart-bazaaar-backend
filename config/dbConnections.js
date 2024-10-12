import mongoose from 'mongoose'

// UserDB connection
export const userDbConnection = mongoose.createConnection(
    process.env.USER_DB_URI
)

// AdminDB connection
export const adminDbConnection = mongoose.createConnection(
    process.env.ADMIN_DB_URI
)

// TransactionDB connection
export const transactionDbConnection = mongoose.createConnection(
    process.env.TRANSACTION_DB_URI
)

// SellerDB connection
export const sellerDbConnection = mongoose.createConnection(
    process.env.SELLER_DB_URI
)
