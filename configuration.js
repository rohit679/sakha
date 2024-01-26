export const getSecret = () => ({
  port: process.env.PORT,
  mongoUrl: process.env.MONGODB_URL,
  timezone: process.env.TZ,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
});