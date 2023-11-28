/* Creating new instace of io and assing it the socketio var! */
let socketio = io();
/* Listening for the "send-bth" button to be click in the dom */
const sendMessage = document.getElementById('msg-form');
// Get the messages container element
const messagesContainer = document.getElementById('messages');

const membersContainer = document.getElementById('members');
let memberCount = 0

// Function to create a new message
const createMessage = (name, message, isGlobal=false) => {
  const currentDate = new Date().toLocaleString();
  let messageTemplate = ``

  if (isGlobal) {
    messageTemplate = `
      <div class="text">
        <span class="muted">${message}</span>
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
  messagesContainer.insertAdjacentHTML('afterbegin', messageTemplate);
};
socketio.on('message', (data) => {
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


const addMember = (name) => {
  let el = document.getElementById("@"+name);
  if (!el) {
    memberCount += 1
    document.getElementById('members-count').innerText = memberCount
    const messageTemplate = `
      <div id="@${name}">
        <span>${name}</span>
      </div>
    `;
    membersContainer.insertAdjacentHTML('beforeend', messageTemplate);
  }
};
socketio.on('connected', (data) => {
    addMember(data.name);
});

const removeMember = (name) => {
  let el = document.getElementById("@"+name);
  if (el) {
    memberCount -= 1
    document.getElementById('members-count').innerText = memberCount
    el.parentNode.removeChild(el)
  }
};
socketio.on('disconnected', (data) => {
    removeMember(data.name);
});
