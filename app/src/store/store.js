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
    if (typeof key === 'string') {
      const newData = { ...this.data, [key]: val }
      // with writeFile the content was when we did it in a loop - for many keys at once
      fs.writeFileSync(this.path, JSON.stringify(newData), { encoding: 'utf8', flag: 'w+' })
      this.data = newData
      return this.emit('changed:' + key, val)
    }

    if (typeof key === 'object') {
      const newData = { ...this.data, ...key }
      fs.writeFileSync(this.path, JSON.stringify(newData), { encoding: 'utf8', flag: 'w+' })
      this.data = newData
      return this.emit('changed-data', newData)
    }
  }
}

function parseDataFile (filePath, defaults) {
  try {
    return {
      ...defaults,
      ...JSON.parse(fs.readFileSync(filePath))
    }
  } catch (error) {
    console.error('Loading user data: ', error)
    return defaults
  }
}

module.exports = Store
