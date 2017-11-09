const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
require('babel-polyfill');

module.exports = {
  entry: ['babel-polyfill', './page/src/index.js'],
  output: {
    path: path.resolve(__dirname, '/public'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          fix: true,
          failOnWarning: true,
          failOnError: true,
          configFile: require.resolve('../.eslintrc'),
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            'react',
            'es2015',
            'stage-2'
          ],
          plugins: [
            'transform-regenerator'
          ],
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            }
          }
        ]
      },
      {
        test: /\.(png|ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      filename: '../public/index.html',
      template: path.resolve(__dirname, '../public/index.html'),
    })
  ]
};
