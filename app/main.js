const { app, Tray, Menu, BrowserWindow } = require('electron')
const path = require('path')
const getTimeFromTasks = require('./src/get-time-from-tasks')
const store = require('./src/store')
const getTextForTray = require('./src/get-text-for-tray')
const getTextFromMinutes = require('./src/get-text-from-minutes')
const { ipcMain } = require('electron')
const logger = {
  log: function (...args) {
    console.log(new Date() + ': ', ...args)
  }
}

const getRefreshTime = require('./src/get-refresh-time')({ logger, fetchTasksTime })

let tray, preferencesWindow = null, refreshTimeLoopHandler
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


function createTray (app) {
  return async function () {
    tray = new Tray(path.join(__dirname, 'assets/todoist3.png'))
    tray.setToolTip('Timedoist')
    tray.setTitle('-')

    const refreshTime = getRefreshTime((value) => {
      tray.setTitle(getTextForTray(getTextFromMinutes, value))
    }, timers)

    tray.setContextMenu(getContextMenu(app, tray, Menu, {
      checkNow: () => refreshTime(store.get('refreshTimeInterval'))
    }))

    refreshTime(store.get('refreshTimeInterval'))

    store.on('changed-data', (newData) => {
      const newDataKeys = Object.keys(newData)
      if (newDataKeys.includes('refreshTimeInterval') || newDataKeys.includes('apiKey') || newDataKeys.includes('todoistLabel')) {
        refreshTime(store.get('refreshTimeInterval'))
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
    height: 550,
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
      authKey: store.get('apiKey'),
      labelPrefix: 't-',
      todoistLabel: store.get('todoistLabel')
    })
    return hours
  } catch (e) {
    console.error('Cannot fetch hours.', e)
    throw e
  }
}

ipcMain.on('user-settings:save', onUserSettingsSave)
ipcMain.on('user-settings:get', onUserSettingsGet)

function onUserSettingsSave (event, payload) {
  savePayloadToStore(payload)
  event.reply('user-settings:save:reply')
}

function onUserSettingsGet (event) {
  event.reply('user-settings:get:reply', { ...store.data })
}

function savePayloadToStore (payload) {
  store.set(payload)
}

function getContextMenu (app, tray, menu, actions) {
  return menu.buildFromTemplate([
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
      label: 'Quit',
      type: 'normal',
      click () {
        app.quit()
      }
    }
  ])
}
