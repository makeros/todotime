const { ipcRenderer } = require('electron')

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
  }
}
