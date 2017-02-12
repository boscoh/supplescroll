"use strict";

let path = require('path');
let webpack = require("webpack");
module.exports = {
    entry: './supplescroll.js',
    // devtool: 'source-map',
    output: {
        path: __dirname,
        filename: 'supplescroll.min.js',
    },
    module: {
        loaders: [
            { 
                test: path.join(__dirname, '.'),
                loader: 'babel-loader',
                query: {
                    presets: 'es2015',
                }, 
            }
        ]
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({minimize: true})
    ],
};