const fs = require('fs')

module.exports = (api, opts, rootOptions) => {
  const utils = require('./utils')(api)

  // modify package.json
  api.extendPackage({
    main: "./dist/main.js",
    devDependencies: {
      "electron": "^5.0.2",
      "electron-builder": "^20.43.0",
      "webpack": "^4.33.0",
      "webpack-cli": "^3.3.2"
    },
    scripts: {
      "dev": "npm run dev:renderer | npm run dev:main",
      "dev:renderer": "npm run serve",
      "dev:main": "webpack --progress --colors --config .electron-config/webpack.dev.js && electron .",
      "start": "npm run pack:renderer && npm run start:main",
      "start:main": "webpack --progress --colors --config .electron-config/webpack.prod.js && electron .",
      "pack": "npm run pack:renderer && npm run pack:main",
      "pack:renderer": "npm run build",
      "pack:main": "webpack --progress --colors --config .electron-config/webpack.prod.js && electron-builder --dir",
      "builder": "npm run pack:renderer && npm run builder:main",
      "builder:main": "webpack --progress --colors --config .electron-config/webpack.prod.js && electron-builder"
    },
    build: {
      directories: {
        output: "build"
      },
      files: [
        "./dist/*"
      ],
      asar: true
    }
  })

  // modify router's mode to hash route # not support history route
  let path
  if (fs.existsSync('src/router/index.js')) {
    path = './src/router/index.js'
  } else if (fs.existsSync('src/router.js')) {
    path = './src/router.js'
  }
  if (path) {
    utils.updateFile(path, lines => {
      // replace router mode to hash
      const reg = /^([\s]*['"]?mode['"]?\s*:\s*['"]?)([\s\S]*?)(['"]?,?[\s\S])*$/
      const index = lines.findIndex(line => line.match(reg))
      if (index !== -1) {
        lines[index] = lines[index].replace(reg, '$1hash$3')
      }
      return lines
    })
  }

  // copy config files to project
  api.render('./templates')

  // update vue.config.js
  utils.updateVueConfig(cfg => {
    cfg.publicPath = './'
    return cfg
  })
}
