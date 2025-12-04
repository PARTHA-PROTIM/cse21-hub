checkAuth();

const token = getToken();
const user = getUser();
let socket;
let typingTimeout;

document.addEventListener('DOMContentLoaded', () => {
    initializeChat();
    loadPreviousMessages();
    
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    
    // Send message on button click
    sendBtn.addEventListener('click', sendMessage);
    
    // Send message on Enter key
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Typing indicator
    messageInput.addEventListener('input', () => {
        socket.emit('typing');
        
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            socket.emit('stop-typing');
        }, 1000);
    });
});

function initializeChat() {
    // Connect to Socket.io server
    socket = io('http://localhost:5000', {
        auth: {
            token: token
        }
    });
    
    socket.on('connect', () => {
        console.log('Connected to chat server');
        document.getElementById('onlineUsers').textContent = 'Connected';
    });
    
    socket.on('disconnect', () => {
        console.log('Disconnected from chat server');
        document.getElementById('onlineUsers').textContent = 'Disconnected';
    });
    
    // Listen for new messages
    socket.on('new-message', (data) => {
        displayMessage(data);
    });
    
    // Listen for user joined
    socket.on('user-joined', (data) => {
        displaySystemMessage(`${data.userName} joined the chat`);
    });
    
    // Listen for user left
    socket.on('user-left', (data) => {
        displaySystemMessage(`${data.userName} left the chat`);
    });
    
    // Typing indicators
    socket.on('user-typing', (data) => {
        document.getElementById('typingIndicator').textContent = `${data.userName} is typing...`;
    });
    
    socket.on('user-stop-typing', () => {
        document.getElementById('typingIndicator').textContent = '';
    });
}

async function loadPreviousMessages() {
    try {
        const response = await fetch(`${API_URL}/chat`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const messages = await response.json();
        
        messages.forEach(msg => {
            displayMessage({
                _id: msg._id,
                userName: msg.userName,
                userRole: msg.userRole,
                message: msg.message,
                userId: msg.user._id,
                createdAt: msg.createdAt
            }, false);
        });
        
        scrollToBottom();
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (message === '') return;
    
    // Emit message through socket
    socket.emit('send-message', {
        message: message
    });
    
    messageInput.value = '';
    socket.emit('stop-typing');
}

function displayMessage(data, scroll = true) {
    const messagesContainer = document.getElementById('chatMessages');
    const isOwnMessage = data.userId === user._id;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isOwnMessage ? 'own' : ''}`;
    
    const time = new Date(data.createdAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-user">${data.userName}</span>
            <span class="message-role ${data.userRole}">${data.userRole}</span>
            <span class="message-time">${time}</span>
        </div>
        <div class="message-content">${escapeHtml(data.message)}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    
    if (scroll) {
        scrollToBottom();
    }
}

function displaySystemMessage(message) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'system-message';
    messageDiv.textContent = message;
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}