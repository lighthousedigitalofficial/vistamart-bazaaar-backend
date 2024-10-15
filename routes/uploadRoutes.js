import express from 'express'
import {
    uploadProductImage,
    uploadSingleImage,
} from '../controllers/uploadController.js'

const router = express.Router()

router.get('/image', uploadSingleImage)
router.get('/image/product', uploadProductImage)

export default router
