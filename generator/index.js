const fs = require('fs')

module.exports = (api, opts, rootOptions) => {
  const utils = require('./utils')(api)

  const pkgConfig = {
    main: './dist/main.js',
    dependencies: {},
    devDependencies: {},
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
        "./dist/**"
      ],
      asar: true
    }
  }

  // electron version
  switch (opts.version) {
    case '5':
      pkgConfig.devDependencies = {
        ...pkgConfig.devDependencies,
        "electron": "^5.0.2",
        "electron-builder": "^20.43.0",
        "webpack": "^4.33.0",
        "webpack-cli": "^3.3.2"
      }
      break
    case '6':
      pkgConfig.devDependencies = {
        ...pkgConfig.devDependencies,
        "electron": "^6.0.1",
        "electron-builder": "^21.2.0",
        "webpack": "^4.39.1",
        "webpack-cli": "^3.3.6"
      }
      break
    case '7':
      pkgConfig.dependencies = {
        ...pkgConfig.dependencies,
        "electron": "^7.1.1"
      }
      pkgConfig.devDependencies = {
        ...pkgConfig.devDependencies,
        "electron-builder": "^22.1.0",
        "webpack": "^4.39.1",
        "webpack-cli": "^3.3.6"
      }
      break
    case '8':
      pkgConfig.dependencies = {
        ...pkgConfig.dependencies,
        "electron": "^8.1.1"
      }
      pkgConfig.devDependencies = {
        ...pkgConfig.devDependencies,
        "electron-builder": "^22.4.1",
        "webpack": "^4.39.1",
        "webpack-cli": "^3.3.6"
      }
      break
    case '9':
      pkgConfig.dependencies = {
        ...pkgConfig.dependencies,
        "electron": "^9.0.3"
      }
      pkgConfig.devDependencies = {
        ...pkgConfig.devDependencies,
        "electron-builder": "^22.7.0",
        "webpack": "^4.39.1",
        "webpack-cli": "^3.3.6"
      }
  }

  // electron-rebuild
  if (opts.rebuild) {
    pkgConfig.devDependencies["electron-rebuild"] = "^1.10.1"
    pkgConfig.scripts["rebuild"] = "electron-rebuild"
    pkgConfig.scripts["postinstall"] = "electron-rebuild install-app-deps"
  }

  const twoPkgPath = opts.twoPkgPath
  // use two package.json
  if (opts.twoPkgFlag) {
    const generator = api.generator
    const pkg = generator.pkg
    const twoPkgConfig = {
      name: pkg.name || '',
      version: pkg.version || '',
      description: pkg.description || '',
      private: true,
      author: pkg.author || '',
      license: pkg.license || '',
      main: './dist/main.js'
    }
    pkgConfig.main = `./${twoPkgPath}/dist/main.js`
    pkgConfig.build.directories.app = twoPkgPath

    if (!fs.existsSync(twoPkgPath)) {
      fs.mkdirSync(twoPkgPath)
    }
    setTimeout(() => {
      fs.writeFileSync(
        `${twoPkgPath}/package.json`,
        JSON.stringify(twoPkgConfig, null, 2),
        { encoding: 'utf8' }
      )
    })
  }

  // modify package.json
  api.extendPackage(pkgConfig)

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
  api.render('./templates', { outputDir: opts.twoPkgFlag ? `../${twoPkgPath}/dist` : '../dist' })

  // update vue.config.js
  utils.updateVueConfig(cfg => {
    cfg.publicPath = './'
    if (!cfg.configureWebpack) {
      cfg.configureWebpack = {}
    }
    cfg.configureWebpack.target = 'electron-renderer'
    if (opts.twoPkgFlag) {
      cfg.outputDir = `${twoPkgPath}/dist`
    }
    return cfg
  })
}
