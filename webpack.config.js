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
        extensions: [ '.ts', '.tsx', '.js' ]
    },
    devServer: { 
        static: { 
            directory: path.join(__dirname, './') 
        } 
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        })
    ],
    performance : {
        hints : false
    } 
};
