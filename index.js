// setup simple electron app
const { app, BrowserWindow, ipcMain, ipcRenderer, shell } = require('electron');
const path = require('path');
const url = require('url');
global.shell = shell;
global.app = app;

const { autoUpdater } = require('electron-updater');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

// Keep a reference for dev mode
let dev = false;

// Check if running in development or production
if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
    dev = true;
}

// Set enviroment
process.env.NODE_ENV = dev ? 'development' : 'production';

// Set path to electron
let electronPath = path.join(__dirname, 'node_modules', '.bin', 'electron');
if (process.platform === 'win32') {
    electronPath += '.cmd';
}

// Set a default web page
let indexPath;
if (dev) {
    // indexPath = 'http://localhost:8080';
}

// Create new window
function createWindow() {
    // Create the browser window and maximize
    win = new BrowserWindow({
        width: 1100,
        height: 600,
        webPreferences: {
            // Preload script
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        },
        frame: false,
        transparent: true,
        fullscreen: false,
        fullscreenable: false,
        maximizable: false,
        resizable: false
    });
    // Maximize window
    // win.maximize();

    // and load the index.html of the app.
    win.loadFile('web/index.html')

    // Open the DevTools.
    if (dev) {
        // win.webContents.openDevTools();
    }

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
}

// Check if ffmpeg is installed
// if not then install
function checkFFmpeg() {
    const { exec } = require('child_process');
    const ffmpegPath = require('ffmpeg-static')
    exec('ffmpeg -version', (error, stdout, stderr) => {
        if (error) {
            console.log('FFmpeg not found');
            if (dev == false) {            
                global.ffmpeg = ffmpegPath.replace('app.asar', 'app.asar.unpacked')
            } else {
                global.ffmpeg = ffmpegPath
            }
        } else {
            console.log('FFmpeg found');
            global.ffmpeg = `ffmpeg `
        }
    });
}

function checkFFprobe() {
    const { exec } = require('child_process');
    const ffprobePath = require('ffprobe-static')
    exec('ffprobe -version', (error, stdout, stderr) => {
        if (error) {
            console.log('FFprobe not found');

            if (dev == false) {
                global.ffmpeg = ffprobePath.replace('app.asar', 'app.asar.unpacked')
            } else {
                global.ffmpeg = ffprobePath
            }
        } else {
            console.log('FFprobe found');
            global.ffmpeg = `ffprobe `
        }
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // Check if ffmpeg is installed
    checkFFmpeg();
    checkFFprobe();
    createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// On macOS it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// When the app is ready, it will send a message to the main process
ipcMain.on("toMain", (event, args) => {
    win.webContents.send("fromMain", "Hello from the renderer process!");
});

ipcMain.on('render', async (event, args) => {
    const { startRender } = require('./js/modules');
    await startRender(args, event, win, dev);
});

ipcMain.on('openVideosFolder', () => {
    shell.openPath(`${process.env.USERPROFILE}\\Videos\\`);
})