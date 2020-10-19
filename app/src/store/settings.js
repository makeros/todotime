const Store = require('./store')

module.exports = new Store({
  configName: 'user-settings',
  defaults: {
    apiKey: '',
    refreshTimeInterval: 1000 * 60 * 60,
    todoistLabel: 't-<minutes>',
    isTodoistPremium: true,
    timeDisplay: 'minutes1',
    includeOverdue: false
  }
})
