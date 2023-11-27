/* Creating new instace of io and assing it the socketio var! */
let socketio = io();
/* Listening for the "send-bth" button to be click in the dom */
const sendMessage = document.getElementById('msg-form');

// Get the messages container element
const messagesContainer = document.getElementById('messages');

// Function to create a new message
const createMessage = (name, message, isGlobal=false) => {
  const currentDate = new Date().toLocaleString();
  let messageTemplate = ``

  if (isGlobal) {
    messageTemplate = `
      <div class="text">
        <span class="muted">&lt;${message}&gt;</span>
        <span class="muted">${currentDate}</span>
      </div>
    `;
  }
  else {
    messageTemplate = `
      <div class="text">
        <span><strong>${name}</strong>: ${message}</span>
        <span class="muted">${currentDate}</span>
      </div>
    `;
  }
  messagesContainer.insertAdjacentHTML('beforeend', messageTemplate);
};
socketio.on('message',(data) => {
    createMessage(data.name, data.message, data.is_global);
});


function sendMessageHandler(event) {
  event.preventDefault();
  const messageInput = document.getElementById('msg-input');
  if (messageInput.value === '') return;
  socketio.emit('message', { data: messageInput.value });
  messageInput.value = '';
}

sendMessage.addEventListener('submit', sendMessageHandler);
