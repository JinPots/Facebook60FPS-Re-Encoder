/* eslint-disable no-undef */
const {
	shell,
	Notification
} = require('electron')
const {
	spawn
} = require('child_process')
let ffmpeg = global.ffmpeg,
	ffmpegProcess,
	win = global.win,
	log = global.log,
	videoOutputPath = global.videoOutputPath

module.exports.startRender = async function (arg) {
	let args = []

	let fileSelect = arg.fileSelect
	let fileName = arg.fileSelect_name.split('.')[0]

	args.push('-i', `${fileSelect.split(/ +/).join('\\ ')}`)
	if (arg.encoder === 'cpu') {
		args.push('-c:v', 'libx264')
	} else if (arg.encoder === 'nvidia') {
		args.push('-c:v', 'h264_nvenc')
	} else if (arg.encoder === 'intel') {
		args.push('-c:v', 'h264_qsv')
	} else if (arg.encoder === 'amd') {
		args.push('-c:v', 'h264_amf')
	}
	args.push('-qp', '29')
	args.push('-crf', '15')
	args.push('-preset', arg.preset)
	args.push('-c:a', arg.audio)
	let bitrate = (arg.bitrate / 1000).toFixed(1) + 'M'
	args.push('-b:v', bitrate)
	args.push('-pix_fmt', arg.pixel.toLowerCase())
	args.push('-rc-lookahead', '15')
	args.push('-vf', `scale=-1:${arg.resolution.split(/ +/).join('')}`)
	args.push(videoOutputPath + '\\' + fileName.split(/ +/).join('\\ ') + '_60fps.mp4')
	args.push('-y')
	let currentTime = process.hrtime()
	console.log(ffmpeg + args.join(' '))
	ffmpegProcess = spawn(ffmpeg, args)
	ffmpegProcess.stdout.setEncoding('utf8')
	ffmpegProcess.stderr.setEncoding('utf8')
	ffmpegProcess.stdout.on('data', (data) => {
		log.info(data)
	})
	ffmpegProcess.stdout.on('close', (data, error) => {
		if (error) {
			console.error(`exec error: ${error}`)
		}
		let tempTime = process.hrtime(currentTime)
		let eplasedTime = (((tempTime[0] * 1000) + (tempTime[1] / 1000000)) / 1000).toFixed(2)
		win.webContents.send('render-finish', (eplasedTime))
		shell.showItemInFolder(videoOutputPath + '\\' + fileName.split(/ +/).join('\\ ') + '_60fps.mp4')
		new Notification({
			title: 'Render finished!',
			body: 'Render time: ' + eplasedTime + 's'
		}).show()
		log.info('Render finished!', 'Render time: ' + eplasedTime + 's')
	})
}

module.exports.sendData = function (channel, args) {
	win.webContents.send(channel, args)
}