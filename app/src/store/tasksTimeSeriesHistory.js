const Store = require('./store')

module.exports = new Store({
  configName: 'tasks-time-series-history',
  defaults: {
    lastSync: null,
    data: []
  }
})
