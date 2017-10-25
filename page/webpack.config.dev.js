const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './page/src/index.js',
  output: {
    path: path.resolve(__dirname, '/public'),
    filename: 'bundle.js',
  },
  devServer: {
    filename: 'bundle.js',
    port: 8080,
    proxy: {
      '/': 'http://localhost:1337'
    },
    watchOptions: {
      ignore: [path.resolve('lib/*.js'), path.resolve('server/*.js')],
      aggregateTimeout: 300
    }
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
            'es2015'
          ]
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
      }
    ]
  },
  devtool: 'eval',
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      filename: '../public/index.html',
      template: path.resolve(__dirname, '../public/index.html'),
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
};
