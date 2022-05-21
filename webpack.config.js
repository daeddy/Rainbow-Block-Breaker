'use strict';
const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require('path');

module.exports = (_, argv) => ({
  devtool: 'inline-source-map',
  entry: './src/index.ts',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    extensions: ['.ts', '.tsx', '.js']
  },
  devServer: {
    static: {
      directory: path.join(__dirname, './')
    }
  },
  devtool: argv.mode === "production" ? 'hidden-source-map' : 'eval',
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      favicon: "./images/favicon.ico"
    })
  ],
});
