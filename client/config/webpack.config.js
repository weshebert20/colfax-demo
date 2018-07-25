const path = require('path');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// Paths
const appRoot = path.resolve( __dirname, '../app' )
const extVendor = path.resolve( __dirname, '../vendor' )
const client = path.resolve( __dirname, '../' )

// Environment flags
const entry = process.env.ENTRY
const isProduction = process.env.npm_lifecycle_event === 'build'
const isHot = process.env.npm_lifecycle_event === 'dev'

const StyleLintPlugin = require( 'stylelint-webpack-plugin' )
const LiveReloadPlugin = require('webpack-livereload-plugin')
const StatsPlugin = require( 'webpack-stats-plugin' ).StatsWriterPlugin

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

// Plugins for all entries
const plugins = [
    new webpack.ProvidePlugin( {
        $: 'jquery'
    }),
    new StyleLintPlugin( {
        configFile: path.join( __dirname, './stylelint.config.js' ),
        context: path.join( client, 'scss' )
    }),
    new webpack.DefinePlugin( {
        dfmBuild: {
            entry: JSON.stringify( entry ),
            isProduction: JSON.stringify( isProduction ),
            isHot: JSON.stringify( isHot )
        }
    }),
    // new HtmlWebpackPlugin({
    //     inject: false,
    //     hash: true,
    //     template: './src/index.html',
    //     filename: 'index.html'
    // }),
    new WebpackMd5Hash()
]

// Initialte Entries
let entryBase = {}

// Conditionally apply plugins and entries depending on whether or not
// we are running hot, or running production
if ( isHot ) {
    if ( !entry || undefined === sites[entry] ) {
        console.warn(
            'You need to specify an entry from this list: \n\n',
            Object.keys( sites ),
            `\n\n You included '${entry}'.`
        )
        process.exit()
    }

    plugins.push(
        new webpack.HotModuleReplacementPlugin()
    )

    // Add dev server to entry
    sites[entry].push( 'webpack-dev-server/client?http://localhost:8080/' )
    sites[entry].push( 'webpack/hot/dev-server' )
}

if ( !isHot ) {
    // Normal Entry Points
    const cssTemplate = isProduction ? 'css/[name].[hash].css' : 'css/[name].css'

    entryBase.common = [
        'matchMedia',
        'headroom',
        'slick-carousel'
    ]
    entryBase.polyfills = path.join( client, 'app/polyfills.js' )

    plugins.push(
        new webpack.optimize.CommonsChunkPlugin( {
            names: ['common'],
            minChunks: 2
        } ),
        new MiniCssExtractPlugin( cssTemplate ),
        // new ExtractTextPlugin( cssTemplate ),
        new LiveReloadPlugin( { appendScriptTag: true } ),
        new StatsPlugin( {
            fields: ['assetsByChunkName', 'hash'],
            transform: function( stats ) {
                return version( stats, isProduction )
            },
            filename: './dfm.version.json'
        } )
    )
}

if ( entry === 'all' || typeof entry === 'undefined' ) {
    entryBase = Object.assign( entryBase, sites )
} else if ( typeof sites[entry] !== 'undefined' ) {
    entryBase[entry] = sites[entry]
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
                test: /\.(sa|sc|c)ss$/,
                use: [
                    isHot ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            }, {
                test: /\/images\/.*\.svg$/,
                use: [{
                    loader: 'url-loader',

                    options: {
                        limit: 15000,
                        name: 'images/[name].[ext]'
                    }
                }]
            }, {
                test: /\/(fonts|scss)\/.*\.svg$/,
                use: [{
                    loader: 'url-loader',

                    options: {
                        limit: 15000,
                        name: 'fonts/[name].[ext]'
                    }
                }]
            }, {
                test: /\.png$/,

                use: [{
                    loader: 'url-loader',
                    options: { mimetype: 'image/png' }
                }]
            }, {
                test: /\.jpg$/,

                use: [{
                    loader: 'url-loader',
                    options: { mimetype: 'image/jpg' }
                }]
            }, {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'url-loader',

                    options: {
                        limit: 10000,
                        mimetype: 'application/font-woff',
                        name: 'fonts/[name].[ext]'
                    }
                }]
            }, {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'url-loader',

                    options: {
                        limit: 10000,
                        mimetype: 'font/truetype',
                        name: 'fonts/[name].[ext]'
                    }
                }]
            }, {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',

                    options: {
                        limit: 10000,
                        name: 'fonts/[name].[ext]'
                    }
                }]
            }, {
                test: /\.md$/,
                use: [{
                    loader: 'null-loader'
                }]
            }, {
                test: /\.js$/,

                use: [{
                    loader: 'eslint-loader',

                    options: {
                        configFile: 'client/config/.eslintrc',
                        cache: true,
                        failOnWarning: false,
                        failOnError: false,
                        emitWarning: true,
                        fix: true
                    }
                }],

                enforce: 'pre'
            } ]
    },

    devServer: {
        hot: true,
        quiet: false,
        noInfo: false,
        contentBase: '/static/',
        publicPath: 'http://localhost:8080/static',
        headers: { 'Access-Control-Allow-Origin': '*' },
        stats: {
            colors: true,
            hash: false,
            version: false,
            assets: false,
            chunks: false,
            modules: false,
            reasons: false,
            children: false,
            source: false,
            warnings: false,
            publicPath: false
        }
    },

    devtool: 'source-map'

};