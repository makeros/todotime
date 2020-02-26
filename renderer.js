// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { ipcRenderer } = require('electron')

module.exports = {
  userSettingsSave: function (payload, cb) {
    // validate the payload before saving it to store
    ipcRenderer.send('user-settings-save', payload)
    ipcRenderer.once('user-settings-saved', cb)
  }
}
