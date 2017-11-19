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
  devServer: {
    filename: 'bundle.js',
    port: 8080,
    proxy: {
      '/api': 'http://localhost:1337'
    },
    watchOptions: {
      ignore: [path.resolve('lib/*.js'), path.resolve('server/*.js')],
      aggregateTimeout: 300
    },
    contentBase: './public'
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
  devtool: 'eval',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        APP_ID: JSON.stringify(process.env.APP_ID || 'myAppId'),
        PARSE_EXTERNAL_URL: JSON.stringify(process.env.PARSE_EXTERNAL_URL || 'http://localhost:55555/api/parse'),
      }
    })
  ]
};
