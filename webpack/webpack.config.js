const webpack = require('webpack');
const path = require('path');
// to produce multiple bundles
// extract common code into a shared file
// var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('shared.js');

// bundle css serparately
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// generates HTML5 file with all bundles
const HtmlWebpackPlugin = require('html-webpack-plugin');
const mainPath = path.resolve(__dirname, '../app', 'entry.js');
const buildPath = path.resolve(__dirname, '../build');

module.exports = {
  watch: true,
  debug: true,
  devtool: 'eval-source-map',
  context: path.resolve(__dirname, '..'),

  entry: [
    'materialize-loader!./webpack/materialize.config.js',
    'webpack-hot-middleware/client?reload=true',
    './app/entry.js'
  ],

  output: {
    path: buildPath,
    publicPath: buildPath,
    filename: 'js/bundle.js'
  },

  plugins: [
    new ExtractTextPlugin('css/styles-bundle.css', {allChunks: false}),
    new HtmlWebpackPlugin({
      template: 'app/index.html',
      inject: 'body'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    // Minify assets.
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],

  devServer: {
    contentBase: buildPath
  },

  module: {
    loaders:[
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader?presets[]=react,presets[]=es2015,presets[]=stage-0',
        presets: ['react', 'es2015', 'stage-0']
      },
      {
        test: /\.(scss|css)$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract('style', 'css', 'sass')
      },
      {
        test: /\.(png|gif|jpe?g)$/,
        loader: 'file?name=/img/[name].[ext]'
      },
      {
        test: /\.svg(\?.*$|$)/,
        loader: 'file-loader?name=/img/[name].[ext]'
      },
      { 
        test: /\.(ttf|eot|woff2?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file?name=/fonts/[name].[ext]" 
      }
    ]
  },

  resolve: {
    extensions: ['', '.js', '.jsx', '.css'],
    modulesDirectories: [ 'components', 'node_modules' ]
  }
};