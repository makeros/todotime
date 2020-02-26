const electron = require('electron')
const path = require('path')
const fs = require('fs')
const EventEmitter = require('events')

class Store extends EventEmitter {
  constructor (opts) {
    super()
    const userDataPath = (electron.app || electron.remote.app).getPath('userData')
    this.path = path.join(userDataPath, opts.configName + '.json')
    this.data = parseDataFile(this.path, opts.defaults)
  }

  get (key) {
    return this.data[key]
  }

  set (key, val) {
    this.data[key] = val
    fs.writeFile(this.path, JSON.stringify(this.data), 'utf8', (err) => {
      if (err) {
        throw err
      }
      this.emit('changed:' + key, val)
    })
  }
}

function parseDataFile (filePath, defaults) {
  try {
    return JSON.parse(fs.readFileSync(filePath))
  } catch (error) {
    return defaults
  }
}

module.exports = new Store({
  configName: 'user-settings',
  defaults: {
    apiKey: '',
    refreshTimeInterval: 1000 * 60 * 60
  }
})
