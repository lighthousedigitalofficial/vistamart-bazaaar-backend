import express from 'express'
import {
    deleteImages,
    getImageUrl,
    getProductImageUrl,
} from '../controllers/uploadController.js'

const router = express.Router()

router.get('/upload', getImageUrl)
router.get('/upload/product', getProductImageUrl)

router.delete('/delete-images', deleteImages)

export default router
