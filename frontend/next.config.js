const withGraphql = require("next-plugin-graphql");
const withProgressBar = require("next-progressbar");
const webpack = require("webpack");

require("dotenv").config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env"
});

const withCSS = require("@zeit/next-css");

module.exports = withGraphql(
  withProgressBar(
    withCSS({
      webpack: config => {
        // Fixes npm packages that depend on `fs` module
        config.node = {
          fs: "empty"
        };

        const env = Object.keys(process.env).reduce((acc, curr) => {
          acc[`process.env.${curr}`] = JSON.stringify(process.env[curr]);
          return acc;
        }, {});

        config.plugins.push(new webpack.DefinePlugin(env));
        return config;
      }
    })
  )
);
