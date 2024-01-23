export const getSecret = () => ({
  port: process.env.PORT,
  mongoUrl: process.env.MONGODB_URL
});