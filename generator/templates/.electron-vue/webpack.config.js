'use strict'

const path = require('path')
// const webpack = require('webpack')

if (process.env.NODE_ENV === '') process.env.NODE_ENV = 'production'

module.exports = {
  mode: process.env.NODE_ENV,
  target: 'electron-main',
  entry: {
    main: path.join(__dirname, './src/main.js')
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist')
  },
  node: {
    __dirname: process.env.NODE_ENV === 'development',
    __filename: process.env.NODE_ENV === 'development'
  }
}
