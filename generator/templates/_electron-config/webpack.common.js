'use strict'

const path = require('path')

module.exports = {
  target: 'electron-main',
  entry: {
    main: path.join(__dirname, '../src/background.js')
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '<%= outputDir %>')
  }
}
