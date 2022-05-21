'use strict';
const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require('path');

module.exports = {
  devtool: 'inline-source-map',
  entry: './src/index.ts',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
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
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      favicon: "./images/favicon.ico"
    })
  ],
  performance: {
    hints: false
  }
};
