const socket = io();
let user;
const chatInput = document.querySelector('#message');

swal.fire({
        title: 'Identify',
        input: 'text',
        text: 'Enter your username to identify yourself in the chat',
        inputValidator: value => {
            return !value && 'Please enter a username';
        },
        allowOutsideClick: false
    })
    .then(result => {
        user = result.value;
        console.log(user);
    });

// Send message on 'Enter' key press
chatInput.addEventListener('keyup', evt => {
    if (evt.key === 'Enter') {
        const message = chatInput.value.trim();
        if (message.length > 0) {
            socket.emit('mensaje', { user, message });
            chatInput.value = ''; // Clear input field
        }
    }
});

// Receive and display messages
socket.on('mensajeLogs', data => {
    const log = document.getElementById('mensajeLogs');
    let messages = '';
    data.forEach(msg => {
        messages += `<li><strong>${msg.user}</strong>: ${msg.message}</li>`;
    });
    log.innerHTML = messages;
});