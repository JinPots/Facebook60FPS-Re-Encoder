function startRender(event) {
    event.preventDefault() // stop the form from submitting
    const formData = {};
    const form = document.querySelector('form');
    const elements = form.elements; // all form elements
    for (let i = 0; i < elements.length; i++) {
        const element = elements.item(i);
        if (element.id) {
            formData[element.id] = element.value;
        }
        if (element.className === 'fileSelect') {
            formData[element.className] = element.files[0].path;
            formData[element.className + '_name'] = element.files[0].name;
        }
    }
    
    const progress = document.getElementById('progress');

    progress.style.display = 'block';
    progress.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Rendering...';
    progress.style.color = 'black';

    // send formData to main process and start render
    window.api.send("render", formData);

    // recieve message when render is finished and open the folder
    window.api.receive("render-finish", (event) => {
        progress.innerText = `Render finished`;
        progress.style.color = '#00ff00';
    });
}

function openVideosFolder() {
    window.api.send("openVideosFolder", null);
}

let file = document.querySelector('#file-select > input');

document.querySelector("#submit").addEventListener('click', () => {
    if (file.files.length <= 0) {
        document.querySelector("#file-select > div > p").classList.add('shake');
        setTimeout(() => {
            document.querySelector("#file-select > div > p").classList.remove('shake');
        }, 550);
    }
});

function random1() {
    window.location.href = 'info.html'
}

window.api.receive('config', (config) => {
    console.log(config)
})

