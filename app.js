import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'
import globalErrorHandler from './controllers/errorController.js'
import AppError from './utils/appError.js'

import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

// ROUTES
import routes from './routes/index.js'

import { cleanCache } from './controllers/handleFactory.js'
import helmet from 'helmet'
import ExpressMongoSanitize from 'express-mongo-sanitize'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

// app.use(
//     cors({
//         origin: [
//             'http://localhost:5173',
//             'http://localhost:5174',
//             'http://localhost:5175',
//             'https://ecomuserpanel.lighthouseclouds.com/',
//             'https://ecommercebaazaar.com/',
//             'https://ebazaar-ten.vercel.app/',
//             'https://ecocmadmin.vercel.app/',
//             'https://vistamart.vercel.app/',
//         ],
//         methods: 'GET,POST,PUT,DELETE',
//         credentials: true,
//     })
// )

const corsOptions = {
    // Allows all origins, CORS will reflect the requesting origin
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}

app.use(
    cors({
        origin: '*', // Allows all origins, but only for testing
        methods: 'GET,POST,PUT,DELETE',
        credentials: true,
        optionSuccessStatus: 200,
    })
)

// Security headers first
app.use(helmet())
// CORS setup before request handling
app.use(cors(corsOptions))
// Parse JSON request body early
app.use(express.json())
// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }))
// Parse cookies before using them (e.g., for auth)
app.use(cookieParser())
// Sanitize the request after body and cookies are parsed
app.use(ExpressMongoSanitize())

// Developing logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: '🛒 Vistamart Bazaar is running successfully',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
    })
})

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// API ROUTES
app.use('/api', routes)

// Clear all caches
app.post('/api/clean-cache', cleanCache)

// Unhandled Routes Handling Middleware
app.all('*', (req, res, next) => {
    next(
        new AppError(`Can't find this ${req.originalUrl} on this server.`, 404)
    )
})

// GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler)

export default app
