module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: '30d',
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
};