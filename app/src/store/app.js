const Store = require('./store')

module.exports = new Store({
  configName: 'app',
  defaults: {
    lastSync: null
  }
})
