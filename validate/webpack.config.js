const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    //插件项
    //plugins: [
    //  new webpack.optimize.CommonsChunkPlugin('common'),
    //  new ExtractTextPlugin("maben.css")
    //],
    //页面入口文件配置
    entry: {
      index: path.join(__dirname, 'src/index.js')
    },
    //入口文件输出配置
    output: {
      path: path.join(__dirname, 'bulid'),
      filename: '[name].js'
    },
    module: {
      //加载器配置
      loaders: [
        {
          test: /\.js$/,
          loader: ['babel-loader'],
          exclude: /node_modules/
        },
        {
          test: /(\.css|\.less)$/,
          //exclude: /node_modules/,
          loader: ['style-loader', 'css-loader', 'less-loader']
        }
      ]
    },
    //其它解决方案配置
    resolve: {
      //查找module的话从这里开始查找
      //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
      extensions: ['.js', '.json', '.less', '.css'],
      //模块别名定义，方便后续直接引用别名，无须多写长长的地址
      alias: {}
    }
};



