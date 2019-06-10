const path = require("path");
const paths = require("../paths");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === "development";
  if (isDevelopment) {
    console.log("building development bundle...");
  }

  return {
    entry: "./src/index.js",
    output: {
      path: paths.appBuild,
      filename: "main.js",
      devtoolModuleFilenameTemplate: info =>
        path.resolve(info.absoluteResourcePath).replace(/\\/g, "/")
    },
    devtool: isDevelopment ? "cheap-module-source-map" : "source-map",
    devServer: {
      stats: "errors-only",
      port: 3000
    },
    module: {
      rules: [
        { test: /\.(js)$/, 
          use: "babel-loader"
        },
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          loader: "url-loader",
          options: {
            limit: 10000,
            name: "static/media/[name].[ext]"
          }
        },
        { test: /\.css$/, 
          use: [
            isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: true,
                sourceMap: isDevelopment,
                importLoaders: 2,
                localIdentName: "[name]__[local]___[hash:base64:5]"
              }
            }
          ] 
        },
        {
          test: /\.scss$/,
          use: [
            isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: true,
                sourceMap: isDevelopment,
                importLoaders: 2,
                localIdentName: "[name]__[local]___[hash:base64:5]"
              }
            }, 
            "sass-loader" 
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                limit: 4096,
                name: "./assets/fonts/[name].[ext]?[hash]"
              }
            }
          ]
        }
      ]
    },
    mode: argv.mode,
    plugins: [
      new HtmlWebpackPlugin({
        template: "public/index.html"
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      })
    ]
  };
};
