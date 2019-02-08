const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const ROOT = path.resolve(__dirname, 'src');
const DESTINATION = path.resolve(__dirname, 'dist');

module.exports = {
  context: ROOT,

  entry: {
    main: './main.ts'
  },

  output: {
    filename: '[name].bundle.js',
    path: DESTINATION
  },

  resolve: {
    extensions: ['.ts', '.js'],
    modules: [ROOT, 'node_modules']
  },

  module: {
    rules: [
      /****************
       * PRE-LOADERS
       *****************/
      {
        enforce: 'pre',
        test: /\.js$/,
        use: 'source-map-loader'
      },
      {
        enforce: 'pre',
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'tslint-loader'
      },

      /****************
       * LOADERS
       *****************/
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: 'awesome-typescript-loader'
      },
      {
        test: /\.css$/,
        use: ['to-string-loader', 'css-loader']
      }
    ]
  },

  devtool: 'cheap-module-source-map',
  devServer: {
    open: true,
    overlay: true
  },
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  },
  plugins: [new CopyWebpackPlugin([{ from: 'assets/**/*', to: '.' }])]
};
