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

	progress.style.display = 'block'
	progress.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Rendering...'
	progress.style.color = 'black'

	window.backend.send('render', formData)

	window.backend.receive('render-finish', (eplasedTime) => {
		progress.innerText = `Render finished in ${eplasedTime} seconds!`
		progress.style.color = '#00ff00'
	})
}

function openVideosFolder() {
	window.backend.send('openVideosFolder', null)
}

let file = document.querySelector('#file-select > input')

document.querySelector('#submit').addEventListener('click', () => {
	if (file.files.length <= 0) {
		document.querySelector('#file-select > div > p').classList.add('shake')
		setTimeout(() => {
			document.querySelector('#file-select > div > p').classList.remove('shake')
		}, 550)
	}
})

document.getElementById('settingsb').addEventListener('click', () => {
	const box = document.getElementById('settings')
	if (box.style.visibility == 'hidden') {
		box.style.visibility = 'visible'
	} else {
		box.style.visibility = 'hidden'
	}
})

async function selectDirs (event) {
	event.preventDefault()
	window.backend.send('select-dirs', (event))

	window.backend.receive('select-dirs-a', (data) => {
		const path = data
		console.log(path)
		document.getElementById('pathSettings').setAttribute('value', path)
	})
}

window.backend.receive('config', (config) => {
	console.log(config)
})


function videoNameSubmit (event) {
	event.preventDefault()
	const videoName1 = document.getElementById('videoName').getAttribute('value')
	console.log(videoName1)
	window.backend.send('videoNameSubmit', (videoName1))
}

function openLink (url) {
	window.location.href = url
}