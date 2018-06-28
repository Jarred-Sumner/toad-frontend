module.exports = {
  isProduction: () => process.env.NODE_ENV === "production",
  BASE_HOSTNAME: process.env.BASE_HOSTNAME,
  BASE_DOMAIN: process.env.BASE_DOMAIN,
  GITHUB_REPO_URL: process.env.GITHUB_REPO_URL,
  IMAGE_HOST: process.env.IMAGE_PROXY_HOST,
  WEBSOCKET_HOSTNAME: process.env.BASE_WEBSOCKETS_HOSTNAME,
  SENTRY_URL: process.env.SENTRY_URL
};
