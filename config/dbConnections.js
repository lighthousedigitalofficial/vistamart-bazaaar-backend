import mongoose from 'mongoose'
import config from './index.js'

mongoose.set('strictQuery', false)

// UserDB connection
export const userDbConnection = mongoose.createConnection(config.userDbURI)

// AdminDB connection
export const adminDbConnection = mongoose.createConnection(config.adminDbURI)

// TransactionDB connection
export const transactionDbConnection = mongoose.createConnection(
    config.transcationDbURI
)

// SellerDB connection
export const sellerDbConnection = mongoose.createConnection(config.sellerDbURI)
