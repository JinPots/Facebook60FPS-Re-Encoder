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

	const progress = document.getElementById('progress')
	progress.style.display = 'flex'

	window.backend.send('render', formData)

	window.backend.receive('render-progress', (data) => {
		console.log(data)
		// ['frame=', '3445', 'fps=', '66', 'q=16.0', 'size=', '', '', '38656kB', 'time=00:00:57.51', 'bitrate=5505.9kbits/s', 'speed=1.09x', '', '', '', '\r']
		const data2 = data.data.split(' ')
		const frame = data2[1]
		const fps = data2[3]
		const bitrate = data2[10].splice('birate='.length)
		const speed = data2[11].splice('speed='.length)
		
	})
	window.backend.receive('render-finish', (eplasedTime) => {
		if (eplasedTime === 'error') {
			const errorBox = document.getElementById('error-dialog')
<<<<<<< HEAD
			errorBox.style.display = 'flex'
			progress.style.display = 'none'
			progress.innerHTML = '<i class="fa fa-exclamation-triangle"></i>'
=======
			errorBox.style.display = 'flex';
			progress.style.display = 'none';
>>>>>>> 710ad53a7c07578b97194b5a1b42444d3a162c51
		} else {
			document.querySelector('#progress > i').classList.remove('fa-circle-o-notch')
			document.querySelector('#progress > i').classList.remove('fa-spin')
			document.querySelector('#progress > i').classList.add('fa-check-circle')
			document.querySelector('#progress > h2').innerHTML = 'Finished!'
			document.querySelector('#summary').style.display = 'flex'
			document.querySelector('#summary > p').innerHTML = `Render finished in ${eplasedTime} seconds!`
		}
	})
}

function openVideosFolder() {
	window.backend.send('openVideosFolder', null)
}