import mongoose from 'mongoose'
import { adminDbConnection } from '../../config/dbConnections'

const bannerSchema = new mongoose.Schema(
    {
        bannerType: {
            type: String,
            required: [true, 'Please provide banner type.'],
        },
        resourceType: {
            type: String,
            enum: ['product', 'category', 'brand', 'shop'],
            required: [true, 'Please provide resource type.'],
        },
        resourceId: {
            type: String,
            required: [true, 'Pleaese provide resource id.'],
        },
        url: {
            type: String,
            required: [true, 'Please provide banner url.'],
            unique: true,
        },
        bannerImage: {
            type: String,
            required: [true, 'Please provide banner image'],
        },
        publish: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
)

const Banner = adminDbConnection.model('Banner', bannerSchema)
export default Banner
