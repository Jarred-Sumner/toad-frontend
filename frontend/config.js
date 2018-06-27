export const isProduction = () => process.env.NODE_ENV === "production";
export const BASE_HOSTNAME = process.env.BASE_HOSTNAME;
export const BASE_DOMAIN = process.env.BASE_DOMAIN;
export const GITHUB_REPO_URL = process.env.GITHUB_REPO_URL;
export const IMAGE_HOST = process.env.IMAGE_PROXY_HOST;
export const WEBSOCKET_HOSTNAME = process.env.BASE_WEBSOCKETS_HOSTNAME;
export const SENTRY_URL = process.env.SENTRY_URL;
