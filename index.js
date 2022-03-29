/* eslint-disable no-undef */
const { app, BrowserWindow, ipcMain, shell } = require('electron')
const Store = require('electron-store')
const { autoUpdater } = require('electron-updater')
const log = require('electron-log')
const path = require('path')
const ffmpegPath = require('ffmpeg-static')


autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
log.info('App starting...')
global.log = log

const store = new Store()
global.store = store

global.shell = shell
global.app = app

let appPath = app.getAppPath()

global.ffmpeg = ffmpegPath.replace('app.asar', 'app.asar.unpacked') + ' '
let win

// Keep a reference for dev mode    
let dev = false

// Check if running in development or production
if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
	dev = true
}

global.dev = dev

if (dev == false) {
	appPath.replace('app.asar', 'app.asar.unpacked')
}

global.videoOutputPath = store.get('path', `${process.env.USERPROFILE}\\Videos\\`)


function createWindow() {
	win = new BrowserWindow({
		width: 1200,
		icon: './assets/icon.ico',
		height: 700,
		webPreferences: {
			// Preload script
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
			contextIsolation: true
		},
		fullscreen: false,
		fullscreenable: false,
		maximizable: false,
		resizable: false
	})
	if (dev == false) {
		win.removeMenu()
	}
	win.loadFile('web/index.html')
	win.webContents.on('new-window', function(e, url) {
		e.preventDefault();
		require('electron').shell.openExternal(url);
	})
	autoUpdater.checkForUpdatesAndNotify()
	global.win = win
}


app.whenReady().then(async () => {
	createWindow()

	// Set AppUserModelId
	if (process.platform === 'win32') {
		app.setAppUserModelId('Facebook 60FPS Re-encoder')
	}

	const { sendData } = require('./js/modules')
	const data = {}
	data.path = store.get('path', `${process.env.USERPROFILE}\\Videos\\`)
	sendData('config', (data))
})


ipcMain.on('toMain', (event, data) => {
	log.info(data)
})

ipcMain.on('render', async (event, args) => {
	const { startRender } = require('./js/modules')
	await startRender(args, event)
})

ipcMain.on('openVideosFolder', () => {
	shell.openPath(`${process.env.USERPROFILE}\\Videos\\`)
})

const { dialog } = require('electron')

ipcMain.on('openLink', (url) => {
	shell.openExternal(url)
})

ipcMain.on('select-dirs', () => {
	const { sendData } = require('./js/modules')
	dialog.showOpenDialog(win, {
		properties: ['openDirectory']
	}).then((data) => {
		const result = `${data.filePaths[0]}`
		store.set('path', `${result}`)
		sendData('select-dirs-a', (result))
	})
})