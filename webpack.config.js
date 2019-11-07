const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('webpack-copy-plugin');
const CleanPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const {ProgressPlugin} = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;
const srcPath = path.resolve(__dirname, 'src');
const buildPath = path.resolve(__dirname, 'build');
const tsconfigPath = path.resolve(__dirname, 'tsconfig.json');

module.exports = {
    mode: isProduction ? 'production' : 'development',
    entry: path.resolve(srcPath, 'main.ts'),
    output: {
        path: buildPath,
        filename: 'app.js'
    },
    resolve: {
        extensions: ['.ts', '.js'],
        plugins: [
            new TsconfigPathsPlugin({
                configFile: tsconfigPath
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: tsconfigPath
                    }
                }
            },
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            sourceMap: isDevelopment
                        }
                    },

                ]
            }

        ]
    },
    devServer: {
        port: 4200,
        contentBase: buildPath
    },
    plugins: [
        new ProgressPlugin(),
        new HtmlPlugin({
            template: path.resolve(srcPath, 'index.html'),
            minify: isProduction
        }),
        new CopyPlugin({
            dirs: [
                {
                    from: path.resolve(srcPath, 'meta'),
                    to: buildPath
                },
                {
                    from: path.resolve(srcPath, 'assets'),
                    to: path.resolve(buildPath, 'assets')
                }
            ]
        })
    ]
};
