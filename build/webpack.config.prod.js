const path = require('path');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const env = require('./prod.env');
const base = require('./webpack.config.base');

base.output.publicPath = './';

base.plugins.unshift(
  new CleanWebpackPlugin([path.resolve(__dirname, '../docs')], {
    root: path.resolve(__dirname, '../')
  }),
  new webpack.DefinePlugin({
    'process.env': env
  })
);

const isDaily = process.env.ASSETS_BUILD_TYPE === 'daily';

if (isDaily) {
  base.devtool = 'source-map';
}

module.exports = Object.assign(base, {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: isDaily
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: { safe: true, discardComments: { removeAll: true } },
      })
    ]
  }
});
