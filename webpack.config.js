const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
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
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new UglifyJSPlugin()
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015'],
        plugins: [
          ['transform-decorators-legacy']
        ]
      }
    }]
  }
}
