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
	})

	window.backend.receive('render-finish', (eplasedTime) => {
		if (eplasedTime === 'error') {
			const errorBox = document.getElementById('error-dialog')
			errorBox.style.display = 'flex';
			progress.style.display = 'none';
		} else {
			document.querySelector("#progress > i").classList.remove('fa-circle-o-notch')
			document.querySelector("#progress > i").classList.remove('fa-spin')
			document.querySelector("#progress > i").classList.add('fa-check-circle')
			document.querySelector("#progress > h2").innerHTML = 'Finished!'
			document.querySelector("#summary").style.display = 'flex'
			document.querySelector("#summary > p").innerHTML = `Render finished in ${eplasedTime} seconds!`
		}
	})
}

function openVideosFolder() {
	window.backend.send('openVideosFolder', null)
}