const fs = require('fs')

module.exports = api => {
  return {
    updateFile(api, file, callback) {
      file = api.resolve(file)
      let content = fs.existsSync(file) ? fs.readFileSync(file, { encoding: 'utf8' }) : ''
    
      content = callback(content.split(/\r?\n/g)).join('\n')
    
      fs.writeFileSync(file, content, { encoding: 'utf8' })
    },
    
    updateVueConfig(callback) {
      let config
      const configPath = api.resolve('vue.config.js')
      if (fs.existsSync(configPath)) {
        config = callback(require(configPath))
      } else {
        config = callback({})
      }
      if (config) {
        fs.writeFileSync(
          configPath,
          `module.exports = ${JSON.stringify(config, null, 2)}`,
          { encoding: 'utf8' }
        )
      }
    }
    
  }
}
