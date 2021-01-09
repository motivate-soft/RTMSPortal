const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    plugins: [
        new webpack.ProvidePlugin({
            _: "lodash",
            $: "jquery",
            jQuery: "jquery",
            jquery: "query",
            auth0: 'auth0-js'
        }),
        // new HtmlWebpackPlugin({
        //     template: '../../index.html',
        //     inject: false,
        //     templateParameters: function(compilation, assets, options) {
        //     return {
        //         files: assets
        //     }
        //     }
        // }),
        // new webpack.DefinePlugin({
        //     buildNumber: JSON.stringify(appConfig.buildNumber),
        //     cacheBust: JSON.stringify(appConfig.buildNumber)
        // }),
        // new MiniCssExtractPlugin({
        //     filename: "[name].[hash].css"
        // }),
        // new CleanWebpackPlugin(['dist']),
        /*new CopyWebpackPlugin([
            {
              from: "../app/views/templates/alertResidentScore.html",
              to: "../dist/app/views/templates/alertResidentScore.html"
            }
          ],
          {
            context: path.join(__dirname, "app/")
          })*/
    ],
    module: {
      rules: [
        { 
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        },
        { test: /angular\.min\.js/, use: "exports-loader?angular" },
        { test: /bootstrap\.min\.js/, use: ["exports-loader?jQuery"] },
        { test: /tableExport\.js/, use: "exports-loader?$" },
        { test: /jquery\.print\.js/, use: "exports-loader?$" },
        { test: /scrollintoview\.js/, use: "exports-loader?$" },
        { test: /angular\-momentjs\.min\.js/, use: "imports-loader?this=>window" },
        {
            test: /\.(jpg|png|gif)$/,
            use: 'file-loader'
        },
        {
            test: /\.(svg|woff|woff2|eot|ttf)$/,
            use: 'file-loader?outputPath=fonts/'
        },
        // {
        //   test: require.resolve("highcharts"),
        //   use: 'expose-loader?Highcharts'
        // }
      ]
    }
}