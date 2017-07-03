const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './app/client.js',
  output: {
    filename: 'client.js',
    path: path.resolve(__dirname, 'dist')
  },
  //plugins: [
  //  new UglifyJSPlugin()
  //],
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }]
  }
}
