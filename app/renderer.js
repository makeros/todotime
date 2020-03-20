// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { ipcRenderer } = require('electron')

module.exports = {
  userSettingsSave: function (cb, payload) {
    // validate the payload before saving it to store
    ipcRenderer.send('user-settings:save', payload)
    ipcRenderer.once('user-settings:save:reply', cb)
  },
  getUserSettings: function (cb) {
    ipcRenderer.send('user-settings:get')
    ipcRenderer.once('user-settings:get:reply', function (event, payload) {
      console.log('------', arguments)
      cb(payload)
    })
  }
}
