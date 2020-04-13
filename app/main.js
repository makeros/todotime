const { app, Tray, Menu, BrowserWindow } = require('electron')
const path = require('path')
const getTimeFromTasks = require('./src/get-time-from-tasks')
const preferencesStore = require('./src/store/preferences')
const appStore = require('./src/store/app')
const getTextForTray = require('./src/get-text-for-tray')
const getTextFromMinutes = require('./src/get-text-from-minutes')
const getTodoistPremiumStatus = require('./src/get-todoist-premium-status')
const getTimeSince = require('./src/get-time-since')
const trayIcon = require('./src/tray-icon')
const { ipcMain } = require('electron')
const logger = {
  log: function (...args) {
    console.log(new Date() + ': ', ...args)
  }
}

const getRefreshTime = require('./src/get-refresh-time')({ logger, fetchTasksTime })

let tray
let preferencesWindow = null

const timers = {
  refreshTimeLoopHandler: null
}

app.on('ready', function () {
  createTray(app)()
  app.dock.hide()
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('user-settings:save', onUserSettingsSave)
ipcMain.on('user-settings:get', onUserSettingsGet)
ipcMain.on('user-settings:check-todoist-premium', async function (event, apiKey) {
  const status = await getTodoistPremiumStatus(apiKey)
  event.reply('user-settings:check-todoist-premium:reply', status)
})

function createTray (app) {
  return async function () {
    tray = new Tray(trayIcon.getNormalIcon())

    tray.setTitle('')

    tray.on('click', () => {
      const menu = getContextMenu(app, tray, Menu, {
        checkNow: () => refreshTime(preferencesStore.get('refreshTimeInterval'))
      })
      tray.popUpContextMenu(menu)
    })

    const refreshTime = getRefreshTime((err, value) => {
      if (err) {
        tray.setImage(trayIcon.getWarningIcon())
      } else {
        tray.setImage(trayIcon.getNormalIcon())
        tray.setTitle(getTextForTray(getTextFromMinutes, value))
        appStore.set('lastSync', new Date().getTime())
      }
    }, timers)

    refreshTime(preferencesStore.get('refreshTimeInterval'))

    preferencesStore.on('changed-data', (newData) => {
      const newDataKeys = Object.keys(newData)
      if (newDataKeys.includes('refreshTimeInterval') || newDataKeys.includes('apiKey') || newDataKeys.includes('todoistLabel')) {
        refreshTime(preferencesStore.get('refreshTimeInterval'))
      }
    })
  }
}

function createPreferencesWindow () {
  if (preferencesWindow !== null) {
    preferencesWindow.focus()
    return
  }
  preferencesWindow = new BrowserWindow({
    width: 960,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  preferencesWindow.loadFile(path.join(__dirname, 'frontend/preferences.html'))

  preferencesWindow.on('closed', function () {
    preferencesWindow = null
  })
}

async function fetchTasksTime () {
  try {
    const hours = await getTimeFromTasks({
      authKey: preferencesStore.get('apiKey'),
      labelPrefix: 't-',
      todoistLabel: preferencesStore.get('todoistLabel')
    })
    return hours
  } catch (e) {
    console.error('Cannot fetch hours.', e)
    throw e
  }
}

function onUserSettingsSave (event, payload) {
  savePayloadToStore(payload)
  event.reply('user-settings:save:reply')
}

function onUserSettingsGet (event) {
  event.reply('user-settings:get:reply', { ...preferencesStore.data })
}

function savePayloadToStore (payload) {
  preferencesStore.set(payload)
}

function getContextMenu (app, tray, menu, actions) {
  const lastSync = getTimeSince(new Date().getTime(), appStore.get('lastSync'))
  return menu.buildFromTemplate([
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
      label: 'Preferences',
      type: 'normal',
      click () {
        createPreferencesWindow()
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
