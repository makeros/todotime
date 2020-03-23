const { app, Tray, Menu, BrowserWindow } = require('electron')
const path = require('path')
const getTimeFromTasks = require('./src/get-time-from-tasks')
const preferencesStore = require('./src/store/preferences')
const appStore = require('./src/store/app')
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

    tray.setTitle('')

    tray.on('click', () => {
      const menu = getContextMenu(app, tray, Menu, {
        checkNow: () => refreshTime(preferencesStore.get('refreshTimeInterval'))
      })
      tray.popUpContextMenu(menu)
    })

    const refreshTime = getRefreshTime((value) => {
      tray.setTitle(getTextForTray(getTextFromMinutes, value)),
      appStore.set('lastSync', new Date())
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

ipcMain.on('user-settings:save', onUserSettingsSave)
ipcMain.on('user-settings:get', onUserSettingsGet)

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
  const lastSync = getDatesSinceFormat(new Date(), appStore.get('lastSync'))
  return menu.buildFromTemplate([
    {
      id: 'syncTime',
      label: 'Last sync: ' + lastSync,
      type: "normal",
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
      type: "normal",
      role: "about"
    },
    {
      label: 'Quit',
      type: 'normal',
      role: "quit"
    }
  ])
}

function getDatesSinceFormat(from, date) {
  let diff = from - date; // the difference in milliseconds

  if (diff < 1000) { // less than 1 second
    return 'right now';
  }

  let sec = Math.floor(diff / 1000); // convert diff to seconds

  if (sec < 60) {
    return sec + ' sec. ago';
  }

  let min = Math.floor(diff / 60000); // convert diff to minutes
  if (min < 60) {
    return min + ' min. ago';
  }

  // format the date
  // add leading zeroes to single-digit day/month/hours/minutes
  let d = date;
  d = [
    '0' + d.getDate(),
    '0' + (d.getMonth() + 1),
    '' + d.getFullYear(),
    '0' + d.getHours(),
    '0' + d.getMinutes()
  ].map(component => component.slice(-2)); // take last 2 digits of every component

  // join the components into date
  return d.slice(0, 3).join('.') + ' ' + d.slice(3).join(':');
}
