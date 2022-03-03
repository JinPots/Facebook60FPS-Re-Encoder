const {
    shell,
    Notification
} = require('electron');
const util = require('util');
const exec = util.promisify(require('child_process').exec)
const fs = require('fs');
const {
    spawn
} = require('child_process');
const path = require('path');
const fluent = require('fluent-ffmpeg');
let ffprobe = global.ffprobe
let ffmpeg = global.ffmpeg
let store = global.store
let videoOutputPath = store.get('savePath'),
    ffmpegProcess

module.exports.startRender = async function (arg, event, win, dev) {
    let args = []

    fluent.setFfprobePath(ffprobe)
    fluent.setFfmpegPath(ffmpeg)

    let fileSelect = arg.fileSelect
    let fileName = arg.fileSelect_name.split('.')[0]

    args.push('-i', `${fileSelect.split(/ +/).join('\\ ')}`);
    if (arg.encoder === 'cpu') {
        args.push('-c:v', 'libx264');
    } else if (arg.encoder === 'nvidia') {
        args.push('-c:v', 'h264_nvenc');
    } else if (arg.encoder === 'intel') {
        args.push('-c:v', 'h264_qsv');
    } else if (arg.encoder === 'amd') {
        args.push('-c:v', 'h264_amf');
    }
    args.push('-qp', '29');
    args.push('-crf', '15');
    args.push('-preset', arg.preset);
    args.push('-c:a', arg.audio);
    let bitrate = (arg.bitrate / 1000).toFixed(1) + 'M';
    args.push('-b:v', bitrate);
    args.push('-pix_fmt', arg.pixel.toLowerCase());
    args.push('-rc-lookahead', '15');
    args.push('-vf', `scale=-1:${arg.resolution.split(/ +/).join('')}`);
    args.push(videoOutputPath + fileName.split(/ +/).join('\\ ') + '_60fps.mp4');
    args.push('-y');
    let currentTime = process.hrtime()
    console.log(ffmpeg + args.join(' '));
    ffmpegProcess = spawn(ffmpeg, args)
    ffmpegProcess.stdout.setEncoding('utf8');
    ffmpegProcess.stderr.setEncoding('utf8');
    ffmpegProcess.stdout.on(`data`, (data) => {
        console.log(data);
    });
    ffmpegProcess.stdout.on(`close`, (data, error) => {
        if (error) {
            console.error(`exec error: ${error}`);
        }
        let tempTime = process.hrtime(currentTime)
        let eplasedTime = (parseFloat(tempTime)).toFixed(2)
        win.webContents.send('render-finish', (eplasedTime));
        shell.openPath(videoOutputPath);
        new Notification({
            title: 'Render finished!',
            body: 'Render time: ' + eplasedTime + "s"
        }).show();
    })
}