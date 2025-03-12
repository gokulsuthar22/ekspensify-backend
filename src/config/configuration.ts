export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },

  database: {
    url: process.env.DATABASE_URL,
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
  },

  mail: {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT, 10) || 465,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
  },

  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
    url: process.env.REDIS_URL,
  },

  s3: {
    bucket: process.env.S3_BUCKET_NAME,
    region: process.env.S3_BUCKET_REGION,
    accessKey: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  jwt: {
    secret:
      process.env.JWT_SECRET ||
      '707bed4bf1eb44dd5a093f5bded06082fbb7ffc5df993c411f42a7177f',
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
  },

  oneSignal: {
    appId: process.env.ONESIGNAL_APP_ID,
    apiKey: process.env.ONESIGNAL_API_KEY,
    baseUrl: process.env.ONESIGNAL_API_BASE_URL,
  },
});
