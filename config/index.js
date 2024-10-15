import dotenv from 'dotenv'

dotenv.config()

const config = {
    port: process.env.PORT || 3000,
    // Databases
    adminDbURI: process.env.ADMIN_DB_URI,
    sellerDbURI: process.env.SELLER_DB_URI,
    userDbURI: process.env.USER_DB_URI,
    transcationDbURI: process.env.TRANSACTION_DB_URI,

    // S3 BUCKET KEYS
    AWSS3BucketName: process.env.AWS_S3_BUCKET_NAME,
    AWSAccessId: process.env.AWS_ACCESS_ID,
    AWSSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,

    // JWT Keys
    jwtSecret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtAccessTime: process.env.JWT_ACCESS_TIME,
    accessTokenExpiresIn: process.env.JWT_ACCESS_TIME,
    refreshTokenExpiresIn: process.env.JWT_REFRESH_TIME,
    redisUrl: process.env.REDIS_URL,
}

export default config
