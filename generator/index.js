const fs = require('fs')

module.exports = (api, opts, rootOptions) => {
  const utils = require('./utils')(api)

  api.extendPackage({
    main: "./dist/main.js",
    devDependencies: {
      "cross-env": "^5.2.0",
      "electron": "^5.0.2",
      "electron-builder": "^20.43.0",
      "webpack": "^4.33.0",
      "webpack-cli": "^3.3.2"
    },
    scripts: {
      "dev": "npm run dev:renderer | npm run dev:main",
      "dev:renderer": "npm run serve",
      "dev:main": "cross-env NODE_ENV=development webpack --progress --colors --config .electron-vue/webpack.config.js && electron .",
      "start": "npm run pack && electron .",
      "pack": "npm run pack:renderer && npm run pack:main",
      "pack:renderer": "npm run build",
      "pack:main": "cross-env NODE_ENV=production webpack --progress --colors --config .electron-vue/webpack.config.js && electron-builder --dir",
      "builder": "npm run pack:renderer && npm run builder:main",
      "builder:main": "cross-env NODE_ENV=production webpack --progress --colors --config .electron-vue/webpack.config.js && electron-builder"
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

  api.postProcessFiles((files) => {
    files['src/router/index.js'] = prettier.format(files['src/router/index.js'], {
      semi: false,
      singleQuote: true,
      parser: 'babylon',
    });
  })

  utils.updateFile(api, 'src/router.js', lines => {
    // replace router mode to hash
    const reg = /^([\s]*['"]?mode['"]?\s*:\s*['"]?)([\s\S]*?)(['"]?,?[\s\S])*$/
    const index = lines.findIndex(line => line.match(reg))
    if (index !== -1) {
      lines[index] = lines.replace(reg, '$1hash$3')
    }
  })

  api.render({
    './.electron-vue': './templates/.electron-vue'
  })

  // update vue.config.js
  utils.updateVueConfig(cfg => {
    cfg.publicPath = './'
    return cfg
  })
}
