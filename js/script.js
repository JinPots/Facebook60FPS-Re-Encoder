
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
    // let progress is rendering when this function is started
    progress.style.display = 'block';
    // Add a spining icon
    progress.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Rendering...';
    // Set progress color to black
    progress.style.color = 'black';

    // send formData to main process and start render
    window.api.send("render", formData);

    // recieve message when render is finished and open the folder
    window.api.receive("render-finish", (event, output, eplasedTime) => {
        console.log(eplasedTime);
        progress.innerText = `Render finished`;
        // style the progress text
        progress.style.color = '#00ff00';
    });
}

function openVideosFolder() {
    window.api.send("openVideosFolder", null);
}

// Get button element with id 'openFolder'
// const openFolderBtn = document.getElementById('openFolder');
// Add event listener to openFolderBtn
// openFolderBtn.addEventListener('click', openVideosFolder); 