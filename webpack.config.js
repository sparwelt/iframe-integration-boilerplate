var path = require('path');
//
//module.rules = [
//    {
//        test: /\.js$/,
//        exclude: /(node_modules|bower_components)/,
//        use: {
//            loader: 'babel-loader',
//            options: {
//                "presets": ["es2015"]
//            }
//        }
//    }
//];

module.exports = {
    entry: './app/client.js',
    output: {
        filename: 'client.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015'],
            }
        }]
    },
};

