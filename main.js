const { app, Tray, Menu, BrowserWindow } = require('electron')
const getTime = require('./src/get-time-from-tasks')
const store = require('./src/store')
const getTextForTray = require('./src/get-text-for-tray')
const getTextFromMinutes = require('./src/get-text-from-minutes')
const { ipcMain } = require('electron')
const logger = {
  log: console.log
}

let tray, mainWindow, refreshHoursLoopHandler

app.on('ready', function () {
  createTray(app)()
  app.dock.hide()
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('user-settings-save', onUserSettingsSave)

function createTray (app) {
  return async function () {
    tray = new Tray('./assets/todoist3.png')
    const contextMenu = getContextMenu(app, tray, Menu)

    tray.setTitle('-')
    tray.setToolTip('Timedoist')
    tray.setContextMenu(contextMenu)

    const minutes = await fetchTasksTime()
    logger.log('refreshHours for the first time ', minutes)
    tray.setTitle(getTextForTray(getTextFromMinutes, minutes))

    const refreshHours = (timeInterval) => {
      return setTimeout(async () => {
        try {
          const minutes = await fetchTasksTime()
          logger.log('refreshHours', minutes)
          tray.setTitle(getTextForTray(getTextFromMinutes, minutes))
        } catch (e) {
          // TODO run logger
          logger.log(e)
        }
        refreshHoursLoopHandler = refreshHours(timeInterval)
      }, timeInterval)
    }
    refreshHoursLoopHandler = refreshHours(store.get('refreshTimeInterval'))

    store.on('changed:refreshTimeInterval', (value) => {
      clearInterval(refreshHoursLoopHandler)
      refreshHoursLoopHandler = refreshHours(value)
    })
  }
}

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadFile('./frontend/index.html')
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

async function fetchTasksTime () {
  try {
    const hours = await getTime({
      authKey: store.get('apiKey'),
      labelPrefix: 't-'
    })
    return hours
  } catch (e) {
    console.error('Cannot fetch hours.')
  }
}

function onUserSettingsSave (event, payload) {
  savePayloadToStore(payload)
  event.reply('user-settings-saved')
}

function savePayloadToStore (payload) {
  Object.entries(payload)
    .forEach(entry => {
      store.set(entry[0], entry[1])
    })
}

function getContextMenu (app, tray, menu) {
  return menu.buildFromTemplate([
    {
      label: 'Check now!',
      type: 'normal',
      async click () {
        const minutes = await fetchTasksTime()
        tray.setTitle(getTextForTray(getTextFromMinutes, minutes))
      }
    },
    {
      label: 'Preferences',
      type: 'normal',
      click () {
        createWindow()
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
