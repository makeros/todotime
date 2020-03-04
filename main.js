const { app, Tray, Menu, BrowserWindow } = require('electron')
const getHours = require('./src/get-hours')
const store = require('./src/store')
const getTextForTray = require('./get-text-for-tray')
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

    const hours = await fetchHours()
    logger.log('refreshHours for the first time ', hours)
    tray.setTitle(getTextForTray(hours))

    const refreshHours = (timeInterval) => {
      return setTimeout(async () => {
        try {
          const hours = await fetchHours()
          logger.log('refreshHours', hours)
          tray.setTitle(getTextForTray(hours))
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

  mainWindow.loadFile('index.html')
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

async function fetchHours () {
  try {
    const hours = await getHours({
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
        const hours = await fetchHours()
        tray.setTitle(getTextForTray(hours))
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
