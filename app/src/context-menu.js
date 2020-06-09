const { Menu } = require('electron')
const getTimeSince = require('./get-time-since')

module.exports = function (appStore) {
  return {
    getContextMenu: function getContextMenu (app, tray, actions) {
      const lastSync = getTimeSince(new Date().getTime(), appStore.get('lastSync'))
      return Menu.buildFromTemplate([
        {
          id: 'syncTime',
          label: 'Last sync: ' + lastSync,
          type: 'normal',
          enabled: false,
          click: () => {}
        },
        { type: 'separator' },
        {
          label: 'Check now!',
          type: 'normal',
          async click () {
            actions.checkNow()
          }
        },
        {
          label: 'Tasks',
          type: 'normal',
          click () {
            actions.createTasksWindow()
          }
        },
        {
          label: 'Preferences',
          type: 'normal',
          click () {
            actions.createPreferencesWindow()
          }
        },
        { type: 'separator' },
        {
          type: 'normal',
          role: 'about'
        },
        {
          label: 'Quit',
          type: 'normal',
          role: 'quit'
        }
      ])
    }
  }
}
