const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    'imooc-cli-monitor': path.resolve(__dirname, './src/index.js'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist'),
  },
  module: {},
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebackPlugin({
      filename: 'index.html',
      template: './public/index.html',
      chunks: ['imooc-cli-monitor'],
    }),
  ],
};