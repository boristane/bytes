const withTypescript = require("@zeit/next-typescript");
module.exports = withTypescript({
  publicRuntimeConfig: {
    URL: process.env.URL
  }
});
