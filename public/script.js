const socket = io();

// DOM Elements
const chatHistory = document.getElementById('chat-history');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Function to add a message to the UI
function addMessageToUI(sender, text, timestamp, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user' : 'antigravity');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    contentDiv.textContent = text;

    const timeDiv = document.createElement('div');
    timeDiv.classList.add('message-timestamp');
    timeDiv.textContent = timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timeDiv);

    chatHistory.appendChild(messageDiv);
    scrollToBottom();
}

function scrollToBottom() {
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Handle sending message
function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    // Optimistically add user message to UI
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    addMessageToUI('You', text, timestamp, true);

    // Emit to server
    socket.emit('userMessage', text);

    // Clear input
    messageInput.value = '';
    messageInput.focus();
}

// Event Listeners
sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Socket Listeners
socket.on('newMessage', (msg) => {
    // msg object: { sender: 'Antigravity', text: string, timestamp: string }
    addMessageToUI(msg.sender, msg.text, msg.timestamp, false);
});
