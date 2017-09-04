const path = require('path')
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const out_path = "/build/livingRoom";

module.exports = {
  movefile:out_path,
  entry: {
    app: path.resolve(__dirname, 'app/index.jsx'),
    // 将 第三方依赖 单独打包
    vendor: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'redux',
      'es6-promise',
      'whatwg-fetch',
      'immutable'
    ]
  },
  output: {
    path: __dirname + out_path,
    filename: "[name].[chunkhash:8].js",
    publicPath: '/livingRoom'
  },
  resolve:{
    extensions: ['', '.web.js', '.js','.jsx','.json'],
    modulesDirectories: ['node_modules', path.join(__dirname, './node_modules')],
    alias: {
      'assets': path.resolve(__dirname, './app/assets'),
      'components': path.resolve(__dirname, './app/components'),
      'devices': path.resolve(__dirname, './app/components/devices'),
      'reflux': path.resolve(__dirname, './app/reflux'),
      'api': path.resolve(__dirname, './app/api')
    }
  },
  module: {
    loaders: [
      { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel' },
      // { test: /\.less$/, exclude: /node_modules/, loader: ExtractTextPlugin.extract('style', 'css!postcss!less') },
      { test: /\.less$/i, loader: ExtractTextPlugin.extract('style', 'css!postcss!less') },
      { test: /\.css$/i, loader: ExtractTextPlugin.extract('style', 'css!postcss') },
      { test: /\.scss$/, exclude: /node_modules/, loader: 'style!css!postcss!sass' },
      // { test: /\.css$/, exclude: /node_modules/, loader: ExtractTextPlugin.extract('style', 'css!postcss') },
      // { test:/\.(png|gif|jpg|jpeg|bmp)$/i, loader:'url-loader?limit=5000&name=img/[name].[chunkhash:8].[ext]' },
      { test:/\.(png|gif|jpg|jpeg|bmp)$/i, loader:'url-loader?limit=50000000' },  // 限制大小5kb
      { test:/\.(woff|woff2|svg|ttf|eot)($|\?)/i, loader:'url-loader?limit=5000&name=fonts/[name].[chunkhash:8].[ext]'}
    ]
  },
  postcss: [
    require('autoprefixer')
  ],
  plugins: [
    // webpack 内置的 banner-plugin
    new webpack.BannerPlugin("Copyright by Het."),
    // html 模板插件
    new HtmlWebpackPlugin({
      template: __dirname + '/app/index.tmpl.html'
    }),
    // 定义为生产环境，编译 React 时压缩到最小
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
    // 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
    new webpack.optimize.OccurenceOrderPlugin(),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        //supresses warnings, usually from module minification
        warnings: false
      }
    }),

    // 分离CSS和JS文件
    // new ExtractTextPlugin('[name].[chunkhash:8].css'),
    // new ExtractTextPlugin('[name].css', { allChunks: true }),
    new ExtractTextPlugin('[name].[chunkhash:8].css', { allChunks: true }),

    // 提供公共代码
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: '[name].[chunkhash:8].js'
    }),
    // 可在业务 js 代码中使用 __DEV__ 判断是否是dev模式（dev模式下可以提示错误、测试报告等, production模式不提示）
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false'))
    }),

    new CopyWebpackPlugin([{
      from: __dirname + '/static',
      to: __dirname + out_path + '/static',
      force:true
    }])
  ]
}