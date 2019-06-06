import { app, BrowserWindow } from 'electron'
import path from 'path'

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow = null

const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8080'
  : `file://${path.join(__dirname, 'index.html')}`

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true // 允许在页面调用 node api
    },
    frame: false // 隐藏窗口外壳
  })
  mainWindow.loadURL(winURL)

  process.env.NODE_ENV === 'development' && mainWindow.webContents.openDevTools()
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closwd', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})