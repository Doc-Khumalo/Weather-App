var path = require('path');
var webpack = require('webpack');

var config = {
   entry: './main.js',

   output: {
       path: path.resolve(__dirname, 'dist'),
       filename: 'index.js',
   },

   devServer: {
      inline: true,
      port: 8081
   },

   module: {
      loaders: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
               presets: ['es2015', 'react']
            }
         },
         {
          test: /\.css$/,
          use: [ 'style-loader', 'css-loader' ]
        }
      ]
   }
}

module.exports = config;
