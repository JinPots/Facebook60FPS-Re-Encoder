const {
	contextBridge,
	ipcRenderer
} = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
	'backend', {
		loadscript(filename) {
			require(filename)
		},
		send: (channel, data) => {
		// whitelist channels
			let validChannels = ['toMain', 'render', 'render-finish', 'render-progress', 'openVideosFolder', 'select-dirs', 'videoNameSubmit']
			if (validChannels.includes(channel)) {
				ipcRenderer.send(channel, data)
			}
		},
		receive: (channel, func) => {
			let validChannels = ['fromMain', 'render-finish', 'render-progress', 'openVideosFolder', 'select-dirs-a']
			if (validChannels.includes(channel)) {
			// Deliberately strip event as it includes `sender` 
				ipcRenderer.on(channel, (event, ...args) => func(...args))
			}
		}
	}
) 