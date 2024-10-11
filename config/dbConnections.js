import mongoose from 'mongoose'

// UserDB connection
const userDbConnection = mongoose.createConnection(process.env.USER_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

// AdminDB connection
const adminDbConnection = mongoose.createConnection(process.env.ADMIN_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

// TransactionsDB connection
const transactionsDbConnection = mongoose.createConnection(
    process.env.TRANSACTIONS_DB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
)

export { userDbConnection, adminDbConnection, transactionsDbConnection }
