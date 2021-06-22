const merge = require('webpack-merge')
const commonConfig = require('./webpack.config.common')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = merge(commonConfig, {
  mode: 'production',
  devtool: '',
  optimization:{
    splitChunks: {
      chunks: 'all'
    },
    minimizer :[
      new OptimizeCssAssetWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  }
})
