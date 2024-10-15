import express from 'express'
import { uploadSingleImage } from '../controllers/uploadController.js'

const router = express.Router()

router.get('/image', uploadSingleImage)

export default router
