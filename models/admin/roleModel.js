import mongoose from 'mongoose'
import { adminDbConnection } from '../../config/dbConnections.js'

const roleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide role name.'],
            unique: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
)

const Role = adminDbConnection.model('Role', roleSchema)

export default Role
