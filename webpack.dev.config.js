const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    'imooc-cli-monitor': path.resolve(__dirname, './src/index.js'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist'),
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, './src'),
    },
    compress: true, // 启用压缩
    port: 9000,
    hot: true,
  },
  module: {},
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebackPlugin({
      filename: 'index.html',
      template: './public/index.html',
      chunks: ['imooc-cli-monitor'],
      scriptLoading: 'blocking',
      inject: 'head',
    }),
  ],
};