import { app, BrowserWindow, screen } from 'electron'
import * as path from 'path'
import isDev from 'electron-is-dev'

// TODO : Implement proper CSP and remove this warning
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
// // Let electron reloads by itself
// if (
//   process.env.ELECTRON_DEBUG === "true" ||
//   process.env.ELECTRON_DEBUG === "vscode"
// ) {
//   // tslint:disable-next-line:no-var-requires
//   require("electron-reload")(__dirname);
// }

function createWindow() {
  // Create the browser window.
  console.log('kkk creating window... ')
  console.log('kkk isDev... ', isDev)
  const screenSize = screen.getPrimaryDisplay().workAreaSize
  const width = screenSize.width
  const height = screenSize.height

  const mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width,
    height,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, '../main/client-preload.js'),
      enableRemoteModule: true,
    },
  })

  const filePath = `file://${path.join(__dirname, '../build/index.html')}`
  console.log('Filet ot load...', filePath)
  mainWindow.loadURL(isDev ? 'http://localhost:53226' : filePath)

  if (process.env.ELECTRON_DEBUG === 'true') {
    // Open the DevTools.
    mainWindow.webContents.openDevTools()
  } else if (!process.env.ELECTRON_DEBUG || process.env.ELECTRON_DEBUG === 'false') {
    // Open window in fullscreen
    mainWindow.setFullScreen(true)
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    // mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.on('before-quit', () => {})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
