const webpack = require('webpack');
const path = require('path');
require('babel-polyfill');

module.exports = {
  entry: ['babel-polyfill', './page/src/index.js'],
  output: {
    path: path.resolve(__dirname, '../public/dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
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
  devtool: 'sourc-map',
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      ecma: 8,
      sourceMap: true,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production'),
        APP_ID: JSON.stringify(process.env.APP_ID || 'myAppId'),
        SERVER_URL: JSON.stringify(process.env.SERVER_URL || 'http://localhost:1337/parse'),
      }
    })
  ]
};
