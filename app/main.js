const { app, Tray, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const getTimeInMinutes = require('./src/get-time-in-minutes')
const settingsStore = require('./src/store/settings')
const appStore = require('./src/store/app')
const getTextForTray = require('./src/get-text-for-tray')
const timeAsDefault = require('./src/time-as-default')
const timeAsMinutes1 = require('./src/time-as-minutes1')
const {
  getTasksWithTimeLabels,
  getTodoistPremiumStatus,
  getCompleteTasksHistory,
  fetchTasksAndLabels
} = require('./src/todoist')

const dbInMemory = require('./src/db-in-memory')(['tasksList'])
const { getContextMenu } = require('./src/context-menu')(appStore)
const trayIcon = require('./src/tray-icon')
const logger = {
  log: function (...args) {
    console.log(new Date() + ': ', ...args)
  }
}

const getRefreshTime = require('./src/get-refresh-time')({ logger, fetchTasksTime: fetchTasks })
const appGlobals = {
  tray: null,
  preferencesWindow: null,
  tasksWindow: null
}

const timers = {
  refreshTimeLoopHandler: null
}

app.on('ready', function () {
  createTray(app)()

  if (app.dock) {
    app.dock.hide()
  }
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('tasks:get-list', function (event) {
  const tasks = dbInMemory.getTable('tasksList') || []
  event.reply('tasks:get-list:reply', { data: tasks })
  console.log('completed tasks', getCompleteTasksHistory({ authKey: settingsStore.get('apiKey') }, { weeks: 2 }))
})
ipcMain.on('user-settings:save', onUserSettingsSave)
ipcMain.on('user-settings:get', onUserSettingsGet)
ipcMain.on('user-settings:check-todoist-premium', async function (event, apiKey) {
  const status = await getTodoistPremiumStatus(apiKey)
  event.reply('user-settings:check-todoist-premium:reply', status)
})

function createTray (app) {
  return async function () {
    appGlobals.tray = new Tray(trayIcon.getNormalIcon())

    appGlobals.tray.setTitle('')

    appGlobals.tray.on('click', () => {
      const menu = getContextMenu(app, appGlobals.tray, {
        checkNow: () => refreshTime(settingsStore.get('refreshTimeInterval')),
        createPreferencesWindow: () => createPreferencesWindow(),
        createTasksWindow: () => createTasksWindow()
      })
      appGlobals.tray.popUpContextMenu(menu)
    })

    const refreshTime = getRefreshTime((err, value) => {
      const timeToDisplay = settingsStore.get('timeDisplay') === 'minutes1' ? timeAsMinutes1 : timeAsDefault
      if (err) {
        appGlobals.tray.setImage(trayIcon.getWarningIcon())
      } else {
        appGlobals.tray.setImage(trayIcon.getNormalIcon())
        appGlobals.tray.setTitle(getTextForTray(timeToDisplay, value))
        appStore.set('lastSync', new Date().getTime())
      }
    }, timers)

    refreshTime(settingsStore.get('refreshTimeInterval'))

    settingsStore.on('changed-data', (newData) => {
      if (shouldRefreshTasksTime(Object.keys(newData))) {
        refreshTime(settingsStore.get('refreshTimeInterval'))
      }
    })
  }
}

function createPreferencesWindow () {
  if (appGlobals.preferencesWindow !== null) {
    appGlobals.preferencesWindow.focus()
    return
  }
  appGlobals.preferencesWindow = new BrowserWindow({
    width: 960,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  appGlobals.preferencesWindow.loadFile(path.join(__dirname, 'frontend/preferences.html'))

  appGlobals.preferencesWindow.on('closed', function () {
    appGlobals.preferencesWindow = null
  })
}

function createTasksWindow () {
  if (appGlobals.tasksWindow !== null) {
    appGlobals.tasksWindow.focus()
    return
  }
  appGlobals.tasksWindow = new BrowserWindow({
    width: 960,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  appGlobals.tasksWindow.loadFile(path.join(__dirname, 'frontend/tasks.html'))

  appGlobals.tasksWindow.on('closed', function () {
    appGlobals.tasksWindow = null
  })
}
async function fetchTasks () {
  try {
    const [fetchedTasks, fetchedLabels] = await fetchTasksAndLabels({
      authKey: settingsStore.get('apiKey'),
      includeOverdue: settingsStore.get('includeOverdue')
    })
    const tasksWithTime = getTasksWithTimeLabels([fetchedTasks, fetchedLabels], {
      todoistLabel: settingsStore.get('todoistLabel')
    })

    const tasksListDB = dbInMemory.getTable('tasksList')
    tasksListDB.clear()
    tasksWithTime.forEach(task => {
      if (task.todotime.labels.length > 0) tasksListDB.add(task)
      console.log('saving task', task)
    })

    return getTimeInMinutes(tasksWithTime)
  } catch (e) {
    console.error('Cannot fetch tasks from todoist.', e)
    throw e
  }
}

function onUserSettingsSave (event, payload) {
  saveSettingsToStore(payload)
  event.reply('user-settings:save:reply')
}

function onUserSettingsGet (event) {
  event.reply('user-settings:get:reply', { ...settingsStore.data })
}

function saveSettingsToStore (payload) {
  settingsStore.set(payload)
}

function shouldRefreshTasksTime (newDataKeys) {
  return newDataKeys.includes('refreshTimeInterval') ||
    newDataKeys.includes('apiKey') ||
    newDataKeys.includes('todoistLabel')
}
