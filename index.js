// setup simple electron app
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
global.shell = shell;
global.app = app;

const ffmpegPath = require('ffmpeg-static')
global.ffmpeg = ffmpegPath.replace('app.asar', 'app.asar.unpacked') + ' '
//const ffprobePath = require('ffprobe-static').path
//global.ffmpeg = ffprobePath.replace('app.asar', 'app.asar.unpacked') + ' '
// const { autoUpdater } = require('electron-updater');

let win;

// Keep a reference for dev mode
let dev = false;

// Check if running in development or production
if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
    dev = true;
}

function createWindow() {
    win = new BrowserWindow({
        width: 1200,
        height: 700,
        webPreferences: {
            // Preload script
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        },
        fullscreen: false,
        fullscreenable: false,
        maximizable: false,
        resizable: false
    });
    win.removeMenu()
    win.loadFile('web/index.html')
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
    const ffprobePath = require('ffprobe-static').path
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
            global.ffprobe = `ffprobe `
        }
    });
}

app.whenReady().then(() => {
    // Check if ffmpeg is installed
    // checkFFmpeg()
    // checkFFprobe()
    createWindow()
})

ipcMain.on('render', async (event, args) => {
    const { startRender } = require('./js/modules');
    await startRender(args, event, win, dev);
});

ipcMain.on('openVideosFolder', () => {
    shell.openPath(`${process.env.USERPROFILE}\\Videos\\`);
})