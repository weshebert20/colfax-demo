const path = require('path');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// Paths
const appRoot = path.resolve( __dirname, '../app' )
const extVendor = path.resolve( __dirname, '../vendor' )
const client = path.resolve( __dirname, '../' )

// Entries
const sites = {
    denverpost: [ path.join( client, 'app/sites/entry/denverpost.js' ) ],
    eastbaytimes: [ path.join( client, 'app/sites/entry/eastbaytimes.js' ) ],
    mercurynews: [ path.join( client, 'app/sites/entry/mercurynews.js' ) ],
    siliconvalley: [ path.join( client, 'app/sites/entry/siliconvalley.js' ) ],
    twincities: [ path.join( client, 'app/sites/entry/twincities.js' ) ],
    modernearthy: [ path.join( client, 'app/sites/entry/modernearthy.js' ) ],
    measuredvibrant: [ path.join( client, 'app/sites/entry/measuredvibrant.js' ) ],
    boldcoastal: [ path.join( client, 'app/sites/entry/boldcoastal.js' ) ],
    dailynews: [ path.join( client, 'app/sites/entry/dailynews.js' ) ]
}


module.exports = {
    entry: { sites },
    output: {
        path: path.resolve( __dirname, '../../static' ),
        publicPath: path.resolve( __dirname, '../../static' ),
        filename: '[name].[chunkhash].js'
    },

    resolve: {
        modules: [ appRoot, extVendor, 'node_modules']
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.scss$/,
                use: [ 'style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
            }
        ]
    },
    plugins: [
        // new ExtractTextPlugin(
        //     {filename: 'style.[hash].css', disable: false, allChunks: true}
        // ),
        new MiniCssExtractPlugin({
            filename: 'style.[contenthash].css',
        }),
        new HtmlWebpackPlugin({
            inject: false,
            hash: true,
            template: './src/index.html',
            filename: 'index.html'
        }),
        new WebpackMd5Hash()
    ]
};