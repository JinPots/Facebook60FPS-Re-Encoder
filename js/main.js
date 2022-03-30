/* eslint-disable no-unused-vars */
let sbb = document.querySelector('#submit')
if (sbb) {
	sbb.addEventListener('click', () => {
		if (document.querySelector('#file-select > input').files.length <= 0) {
			document.querySelector('#file-select > div > p').classList.add('shake')
			setTimeout(() => {
				document.querySelector('#file-select > div > p').classList.remove('shake')
			}, 550)
		}
	})
}

let stbb = document.getElementById('settingsb')
if (stbb) {
	stbb.addEventListener('click', () => {
		const box = document.getElementById('settings')
		if (box.style.visibility == 'hidden') {
			box.style.visibility = 'visible'
		} else {
			box.style.visibility = 'hidden'
		}
	})
}

async function selectDirs(event) {
	event.preventDefault()
	window.backend.send('select-dirs', (event))
	window.backend.receive('select-dirs-a', (data) => {
		if (data == 'undefined') return
		console.log(data)
		document.getElementById('pathSettings').setAttribute('value', data || '')
	})
	document.getElementById('pathSettings').blur()
}

function videoNameSubmit(event) {
	event.preventDefault()
	const videoName1 = document.getElementById('videoName').getAttribute('value')
	console.log(videoName1)
	window.backend.send('videoNameSubmit', (videoName1))
}

const resolutionChange = () => {
	const resolution = document.getElementById('resolution').value
	if (resolution === '720') {
		document.getElementById('qp').value = 24
		document.getElementById('crf').value = 8
	} else if (resolution === '1080') {
		document.getElementById('qp').value = 21
		document.getElementById('crf').value = 5
	}
}

function addVideo() {
	document.querySelector('#backdrop').classList.add('active')
	document.querySelector('#credit').style.color = 'white'
	document.querySelectorAll('#credit>p>a').forEach(function(e) {
		e.style.color = 'lightblue'
	})
	
	// set title
	const video = document.querySelector('#file-select > input')
	document.querySelector('#preview > p').innerHTML = 'File selected: ' + video.files[0].name
}

function cancelVideo() {
	document.querySelector('#backdrop').classList.remove('active')
	document.querySelector('#credit').style.color = 'black'
	document.querySelectorAll('#credit>p>a').forEach(function(e) {
		e.style.color = '#007bff'
	})
	document.querySelector('#advanced').style.display = 'none'
	document.querySelector('#file-select > input').value = ''
	document.getElementById('pathSettings').setAttribute('value', '')
	document.querySelector('#progress').style.display = 'none'
}

// aka toggle advanced settings
function toggleRibbon() {
	const advancedSetings = document.querySelector('#advanced')
	if (advancedSetings.style.display == 'none') {
		advancedSetings.style.display = 'block'
		return
	}
	advancedSetings.style.display = 'none'
}