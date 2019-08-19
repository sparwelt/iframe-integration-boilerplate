const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    'client': './app/client.js', // will be  ./build/application/bundle.js,
    'host': './app/host.js'// will be  ./build/library/bundle.js
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: [
            [
              '@babel/plugin-proposal-decorators',
              { legacy: true },
            ],
          ]
        }
      }
    }]
  }
}
