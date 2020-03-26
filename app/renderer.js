const { ipcRenderer, remote } = require('electron')

module.exports = {
  userSettingsSave: function (cb, payload) {
    // TODO: validate the payload before saving it to store
    ipcRenderer.send('user-settings:save', payload)
    ipcRenderer.once('user-settings:save:reply', (event) => cb(undefined, event))
  },
  getUserSettings: function (cb) {
    ipcRenderer.send('user-settings:get')
    ipcRenderer.once('user-settings:get:reply', function (event, payload) {
      cb(payload)
    })
  },
  checkTodoistPremium: function (cb, apiKey) {
    ipcRenderer.send('user-settings:check-todoist-premium', apiKey)
    ipcRenderer.once('user-settings:check-todoist-premium:reply', (event, isPremium) =>
      cb(isPremium, event)
    )
  },
  closeWindow: function () {
    remote.getCurrentWindow().close()
  }
}
