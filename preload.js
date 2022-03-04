const {
	contextBridge,
	ipcRenderer
} = require('electron')

contextBridge.exposeInMainWorld(
	'backend', {
		loadscript(filename) {
			require(filename)
		},
		send: (channel, data) => {
			ipcRenderer.send(channel, data)
		},
		receive: (channel, func) => {
			ipcRenderer.on(channel, (event, ...args) => {
				func(...args)
			})
		}
	})
