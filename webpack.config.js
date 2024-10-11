const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const PugPlugin = require("pug-plugin");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const ErrorNotificationPlugin = require("webpack-error-notification-plugin");

const devMode = process.env.NODE_ENV !== "production";
const isProduction = process.env.NODE_ENV === "production";

const browserSync = new BrowserSyncPlugin({
    host: "localhost",
    port: 3000,
    proxy: "http://localhost:8080/",
});

const moduleReplacement = new webpack.HotModuleReplacementPlugin();
const noEmit = new webpack.NoEmitOnErrorsPlugin();

const pages = new PugPlugin({
    entry: [
      // add pages here
      {
        import: 'views/index.pug', // Pug template
        filename: 'index.html', // output HTML into dist/index.html
      },
    ],
    js: {
      filename: 'js/[name].[contenthash:8].js', // JS output filename
    },
    css: {
      filename: 'css/[name].[contenthash:8].css', // CSS output filename
    },
});

module.exports = {
    output: {
        path: `${__dirname}/dist`,
    },

    resolve: {
        // aliases used in SCSS and in templates
        alias: {
            "@images": `${__dirname}/images`,
            "@styles": `${__dirname}/scss`,
            "@scripts": `${__dirname}/js`,
        },
    },

    devServer: {
        hot: true,
        static: "./dist",
    },

    devtool: devMode ? "inline-source-map" : false,

    performance: {
        hints: false,
    },

    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"],
                },
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "css-loader",
                        options: { sourceMap: devMode, url: true },
                    },
                    {
                        loader: "sass-loader",
                        options: { sourceMap: true },
                    },
                ],
            },
            {
                test: /\.(jp?g|png|gif|svg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext]'
                },
            },
        ],
    },

    plugins: [
        new CleanWebpackPlugin(),
        new ErrorNotificationPlugin(),
        browserSync,
        pages,
        noEmit,
        moduleReplacement,
    ],
};
