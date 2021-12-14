const path = require("path");

module.exports = {
  entry: {
    index: "./index.js",
    dashboard: "./main.js",
    login: "./login.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "./dist"),
  },
  mode: "none",
};
