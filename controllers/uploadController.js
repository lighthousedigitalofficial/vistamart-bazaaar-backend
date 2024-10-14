import AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'

import config from '../config/index.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'

const s3 = new AWS.S3({
    accessKeyId: config.AWSAccessId,
    secretAccessKey: config.AWSSecretAccessKey,
})

export const uploadSingleImage = catchAsync(async (req, res, next) => {
    // Get the file type from query or default to 'jpeg'
    const fileType = req.query.fileType || 'jpeg'

    // Allow multiple file types
    const validFileTypes = ['jpeg', 'png', 'webp', 'gif']

    if (!validFileTypes.includes(fileType)) {
        return next(new AppError('Invalid file type', 400))
    }

    const key = `${uuidv4()}.${fileType}`

    // Use promise-based getSignedUrl to handle async properly
    const params = {
        Bucket: config.AWSS3BucketName,
        ContentType: `image/${fileType}`,
        Key: key,
    }

    const url = await s3.getSignedUrlPromise('putObject', params)

    res.status(200).send({ key, url })
})

export const uploadProductImage = catchAsync(async (req, res, next) => {
    // Get the file type from query or default to 'jpeg'
    const fileType = req.query.fileType || 'jpeg'

    // Allow multiple file types
    const validFileTypes = ['jpeg', 'png', 'webp', 'gif']

    if (!validFileTypes.includes(fileType)) {
        return next(new AppError('Invalid file type', 400))
    }

    const key = `${req.user._id}/${uuidv4()}.${fileType}`

    // Use promise-based getSignedUrl to handle async properly
    const params = {
        Bucket: config.AWSS3BucketName,
        ContentType: `image/${fileType}`,
        Key: key,
    }

    const url = await s3.getSignedUrlPromise('putObject', params)

    res.status(200).send({ key, url })
})

export const deleteImage = catchAsync(async (req, res, next) => {
    const { key } = req.params // Key of the image in S3 bucket

    if (!key) {
        return next(new AppError('Image key is required', 400))
    }

    const params = {
        Bucket: config.AWSS3BucketName,
        Key: key,
    }

    await s3.deleteObject(params).promise()

    res.status(200).send({ message: 'Image deleted successfully' })
})

export const updateImage = catchAsync(async (req, res, next) => {
    const { key } = req.params // Key of the image to update
    const fileType = req.query.fileType || 'jpeg'

    // Validate file type
    const validFileTypes = ['jpeg', 'png', 'webp', 'gif']
    if (!validFileTypes.includes(fileType)) {
        return next(new AppError('Invalid file type', 400))
    }

    if (!key) {
        return next(new AppError('Image key is required', 400))
    }

    // First, delete the existing image
    const deleteParams = {
        Bucket: config.AWSS3BucketName,
        Key: key,
    }
    await s3.deleteObject(deleteParams).promise()

    // Then, create a new upload URL for the updated image
    const newKey = `${uuidv4()}.${fileType}`
    const uploadParams = {
        Bucket: config.AWSS3BucketName,
        ContentType: `image/${fileType}`,
        Key: newKey,
    }

    const url = await s3.getSignedUrlPromise('putObject', uploadParams)

    res.status(200).send({ key: newKey, url })
})
