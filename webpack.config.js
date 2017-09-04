const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');


module.exports = {
    // 设置入口
    entry: path.resolve(__dirname, 'app/index.jsx'),
    // 设置出口
    output: {
        path: __dirname + "/build",
        filename: "bundle.js"
    },
    resolve:{
        // 设置处理文件类型
        extensions: ['', '.web.js', '.js','.jsx','.json'],
        // 设置排除目录
        modulesDirectories: ['node_modules', path.join(__dirname, './node_modules')],
        // 设置别名路径
        alias: {
            'assets': path.resolve(__dirname, './app/assets'),
            'components': path.resolve(__dirname, './app/components'),
            'devices': path.resolve(__dirname, './app/components/devices'),
            'reflux': path.resolve(__dirname, './app/reflux'),
            'api': path.resolve(__dirname, './app/api')
        }
    },

    module: {
        preLoaders: [
            // 开启ESlint的语法检查
            {test: /\.(js|jsx)$/, loader: "eslint-loader", exclude: /node_modules/}
        ],
        loaders: [
            // 进行ES6的转换  和  react的对应转换
            {
                test: /\.jsx$/, exclude: /node_modules/, loader: 'babel',
                query: {
                    plugins: [
                        'external-helpers', // why not work?
                        ["transform-runtime", { polyfill: false }],
                        ["import", [{ "style": "css", "libraryName": "antd-mobile" }]]
                    ],
                    presets: ['es2015', 'stage-0', 'react']
                }
            },
            { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel'},
            // css less scss转css   和  自动加兼容各浏览器的前缀
            { test: /\.less$/i, loader: ExtractTextPlugin.extract('style', 'css!postcss!less') },
            { test: /\.css$/i, loader: ExtractTextPlugin.extract('style', 'css!postcss') },
            { test: /\.scss$/, exclude: /node_modules/, loader: 'style!css!postcss!sass' },
            // 图片转base64位
            { test:/\.(png|gif|jpg|jpeg|bmp)$/i, loader:'url-loader?limit=5000' },
            { test:/\.(woff|woff2|svg|ttf|eot)($|\?)/i, loader:'url-loader?limit=5000'}
        ]
    },

    eslint: {
        configFile: '.eslintrc' // Rules for eslint
    },

    postcss: [
        require('autoprefixer') //调用autoprefixer插件，例如 display: flex
    ],

    plugins: [
        // html 模板插件
        new HtmlWebpackPlugin({
            template: __dirname + '/app/index.tmpl.html'
        }),

        // 热加载插件
        new webpack.HotModuleReplacementPlugin(),

        // 打开浏览器
        new OpenBrowserPlugin({
          url: 'http://localhost:7777'
        }),

        // 可在业务 js 代码中使用 __DEV__ 判断是否是dev模式（dev模式下可以提示错误、测试报告等, production模式不提示）
        new webpack.DefinePlugin({
          __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false'))
        }),
        // 抽离公共chunck  优化
        new ExtractTextPlugin('[name].css', { allChunks: true }),
    ],

    devServer: {
        // 设置ip可以访问  而非单单localhost  和  127.0.0.1
        disableHostCheck: true,
        port:'7777',
        contentBase: "./", //本地服务器所加载的页面所在的目录
        colors: true, //终端中输出结果为彩色
        historyApiFallback: true, //不跳转
        inline: true, //实时刷新
        hot: true  // 使用热加载插件 HotModuleReplacementPlugin
    }
}