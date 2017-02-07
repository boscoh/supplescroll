var path = require('path');
var webpack = require("webpack");
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
        // Avoid publishing files when compilation fails
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({minimize: true})
    ],
};