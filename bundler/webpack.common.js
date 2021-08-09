const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const ESLintPlugin = require('eslint-webpack-plugin');
const path = require('path')

// const rootFilePath = path.resolve(__dirname, '../src/script.js')
const rootFilePath = path.resolve(__dirname, '../src/jesus.ts')
const rootHtmlFilePath = path.resolve(__dirname, '../src/index.html')

module.exports = {
    entry: rootFilePath,
    output:
    {
        filename: 'bundle.[contenthash].js',
        path: path.resolve(__dirname, '../dist')
    },
    devtool: 'source-map',
    plugins:
    [
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, '../static') }
            ]
        }),
        new HtmlWebpackPlugin({
            template: rootHtmlFilePath,
            minify: true
        }),
        new MiniCSSExtractPlugin(),
        new ESLintPlugin({
            context: rootFilePath,
            extensions: ["js", "ts", "tsx", "json"],
            exclude: ["node_modules"],
            fix: true,
            formatter: "stylish",
        })
    ],
    module:
    {
        rules:
        [
            // HTML
            {test: /\.(html)$/, use: ['html-loader']},

            // JS
            {test: /\.js$/, exclude: /node_modules/, use: ['babel-loader']},

            // TS
            {test: /\.tsx?$/, use: ["ts-loader"], exclude: /node_modules/},

            // CSS
            {
                test: /\.css$/,
                use:
                [
                    MiniCSSExtractPlugin.loader,
                    'css-loader'
                ]
            },

            // Images
            {
                test: /\.(jpg|png|gif|svg)$/,
                use:
                [
                    {
                        loader: 'file-loader',
                        options:
                        {
                            outputPath: 'assets/images/'
                        }
                    }
                ]
            },

            // Fonts
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                use:
                [
                    {
                        loader: 'file-loader',
                        options:
                        {
                            outputPath: 'assets/fonts/'
                        }
                    }
                ]
            }
        ]
    }
}
