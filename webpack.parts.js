const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const colors = require('colors');


module.exports = {

  define: (name, value) => ({
    plugins: [
      new webpack.DefinePlugin({ [name]: JSON.stringify(value) })
    ]
  }),

  copy: (from, to) => ({
    plugins: [
      new CopyWebpackPlugin([{ from, to }], { copyUnmodified: true }),
    ]
  }),

  setupCoffee: () => ({
    module: {
      preLoaders: [{
        test: /\.coffee$/, // include .coffee files
        exclude: /node_modules|bower_components/, // exclude any and all files in the node_modules folder
        loader: 'coffeelint-loader'
      }],
      loaders: [{
        test: /\.coffee$/,
        loader: 'ng-annotate!coffee-loader',
        exclude: /node_modules|bower_components/
      }]
    }
  }),

  setupScss: () => ({
    module: {
      loaders: [{
        test: /\.scss$/,
        loader: 'style!css!sass'
      }, {
        test: /\.css$/,
        loader: "style!css"
      }]
    }
  }),

  setupMedia: () => ({
    module: {
      loaders: [{
        test: /\.(woff|woff2|ttf|eot|svg)(\?]?.*)?$/,
        loader: 'file-loader?name=res/[name].[ext]?[hash]'
      }, {
        // inline base64 URLs for <=8k images, direct URLs for the rest
        test: /\.(png|jpg|jpeg|gif)$/,
        // include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'bower_components')],
        loader: 'url-loader?name=./img/[name].[ext]?[hash]&limit=8192'
      }, {
        test: /\.(webm|mp4|ogv)$/,
        loader: 'file-loader?name=textures/[name].[ext]'
      }, {
        test: /\.json$/,
        loader: 'file-loader?name=./fonts/[name].[ext]?[hash]',
        exclude: /node_modules|bower_components/
      }]
    }
  }),

  setupPug: (angularTemplates, root) => ({
    module: {
      loaders: [{
        // don't touch angular templates
        test: /\.pug/,
        exclude: angularTemplates,
        loaders: [
          'pug'
        ]
      }, {
        // only handle angular templates
        test: /\.pug$/,
        include: angularTemplates,
        loaders: [
          'ngtemplate?requireAngular&relativeTo=/src/app/',
          'html?root=' + root + '&attrs=img:src img:ng-src img:md-svg-src&interpolate',
          'jade-html-loader'
        ]
      }]
    }
  }),

  extractBundle: (options) => ({
    entry: {
      [options.name]: options.entries
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        names: [options.name, 'manifest']
      })
    ]
  }),

  extractCss: (path) => ({
    module: {
      loaders: [{
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css'),
        include: path
      }]
    },
    plugins: [
      new ExtractTextPlugin('[name].[chunkhash].css')
    ]
  }),

  createIndex: () => ({
    plugins: [
      new HtmlWebpackPlugin({
        chunks: ['manifest', 'bundle', 'vendor'],
        template: '!pug-loader!./src/app/index.pug'
      })
    ]
  }),

  minify: () => ({
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
          warnings: false
        },
        output: {
          comments: false
        }
      })
    ]
  }),

  enableHotReloading: () => ({
    entry: {
      bundle: ['webpack/hot/dev-server']
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  }),

  progressBar: () => ({
    plugins: [
      new ProgressBarPlugin({
        format: '  build [:bar] ' + colors.green.bold(':percent') + ' (:elapsed seconds)',
        clear: false
      })
    ]
  }),

  clean: (path) => ({
    plugins: [
      new CleanWebpackPlugin([path], { root: process.cwd() })
    ]
  }),
};
