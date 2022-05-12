/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
function startRender(event) {
	event.preventDefault() // stop the form from submitting
	const formData = {}
	const form = document.querySelector('form')
	const elements = form.elements // all form elements
	for (let i = 0; i < elements.length; i++) {
		const element = elements.item(i)
		if (element.id) {
			formData[element.id] = element.value
		}
		if (element.className === 'fileSelect') {
			formData[element.className] = element.files[0].path
			formData[element.className + '_name'] = element.files[0].name
		}
	}

	// showing error for gpu related issue
	const gpuAval = document.querySelector("#gpu-aval");
	const gpuSelected = elements[6].value;
	switch (gpuSelected) {
		case 'cpu': 
			gpuAval.style.display = 'none';
		case 'nvidia':
			gpuAval.innerHTML = "NVIDIA GPU isn't available on your system.";
			break;
		case 'amd':
			gpuAval.innerHTML = "AMD GPU isn't available on your system.";
			break;
		case 'intel':
			gpuAval.innerHTML = "Intel GPU isn't available on your system.";
			break;
		default:
			gpuAval.innerHTML = "GPU selection is invaild.";
			break;
	}

	const progress = document.getElementById('progress')
	progress.style.display = 'flex'

	window.backend.send('render', formData)

	window.backend.receive('render-progress', (data) => {
		let logs = data.data.replace(/ +(?= )/g,'')
		
		const textLog = document.querySelector('#progress-log')
		textLog.innerHTML = textLog.innerHTML + logs + '<br>'
		textLog.scrollTop = textLog.scrollHeight

		const status = document.querySelector('#progress-status')
		logSplit = logs.split(' ')
		if (!logs.startsWith('frame')) return
		const frame = logSplit[1]
		const fps = logSplit[2].split('=')[1]
		const size = logSplit[5]
		const time = logSplit[6].split('=')[1]
		const bitrate = logSplit[7].split('=')[1]
		status.innerHTML = `<p>Progressed ${frame} frames, ${time}, ${size}. (avg ${fps}FPS, ${bitrate})</p>`
	})

	window.backend.receive('render-finish', (eplasedTime) => {
		if (eplasedTime === 'error') {
			const errorBox = document.getElementById('error-dialog')
			errorBox.style.display = 'flex'
			progress.style.display = 'none'
			return
		}

		document.querySelector('#progress > i').classList.remove('fa-circle-o-notch')
		document.querySelector('#progress > i').classList.remove('fa-spin')
		document.querySelector('#progress > i').classList.add('fa-check-circle')
		document.querySelector('#progress > h2').innerHTML = 'Finished!'
		document.querySelector('#summary').style.display = 'flex'
		document.querySelector('#summary > p').innerHTML = `Render finished in ${eplasedTime} seconds.`
	})
}

function openVideosFolder() {
	window.backend.send('openVideosFolder', null)
}


// function stop() {
// 	window.backend.send('stop', null)
// }