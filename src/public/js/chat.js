const socket = io();
let user;
let chat = document.querySelector('#message');

swal.fire({
        title: 'Identify',
        input: 'text',
        text: 'Enter your username to identify yourself in the chat',
        inputValidator: value => {
            return !value && 'Write a username to enter';
        },
        allowOutsideClick: false
    })
    .then(result => {
        user = result.value;
        console.log(user);
    });

// Chat input event listener
chat.addEventListener('keyup', evt => {
    if (evt.key === 'Enter') {
        const message = chat.value.trim(); // Get the trimmed value of the chat input
        if (message.length > 0) {
            socket.emit('mensaje', { user, mensaje: message });
            chat.value = ''; // Clear the chat input
        }
    }
});


socket.on('mensajeLogs', data => {
    //console.log('mensajes del server', data)
    let log = document.getElementById('mensajeLogs');
    let messages = '';
    data.forEach(message => {
        messages += `<li>${message.user} - dice: ${message.mensaje}</li>`;
    });
    log.innerHTML = messages;
});