
// Global variables
let conversationId = '';
let isLoading = false;
const API_BASE_URL = 'http://localhost:8000';

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    generateConversationId();
    setupEventListeners();
    focusInput();
});

function generateConversationId() {
    conversationId = 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function setupEventListeners() {
    const input = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');

    // Auto-resize textarea
    input.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    // Handle Enter key
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Send button click
    sendButton.addEventListener('click', sendMessage);
}

function focusInput() {
    document.getElementById('messageInput').focus();
}

function getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function hideError() {
    document.getElementById('error-message').style.display = 'none';
}

// Simplified markdown parser
function parseMarkdown(text) {
    // Escape HTML first
    text = text.replace(/[<>&"']/g, function (m) {
        return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": "&#39;" }[m];
    });

    // Headers
    text = text.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    text = text.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    text = text.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // Italic
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/_(.*?)_/g, '<em>$1</em>');

    // Code blocks
    text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Inline code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Links
    text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Blockquotes
    text = text.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Horizontal rules
    text = text.replace(/^---$/gim, '<hr>');
    text = text.replace(/^\*\*\*$/gim, '<hr>');

    // Lists
    text = text.replace(/^\* (.*$)/gim, '<li>$1</li>');
    text = text.replace(/^\- (.*$)/gim, '<li>$1</li>');
    text = text.replace(/^\+ (.*$)/gim, '<li>$1</li>');
    text = text.replace(/^(\d+)\. (.*$)/gim, '<li>$1. $2</li>');

    // Wrap consecutive list items in ul/ol tags
    text = text.replace(/(<li>.*<\/li>)/s, function (match) {
        if (match.includes('<li>1.') || /\d+\./.test(match)) {
            return '<ol>' + match.replace(/(\d+)\. /g, '') + '</ol>';
        } else {
            return '<ul>' + match + '</ul>';
        }
    });

    // Paragraphs
    text = text.replace(/\n\s*\n/g, '</p><p>');
    text = '<p>' + text + '</p>';

    // Clean empty paragraphs
    text = text.replace(/<p><\/p>/g, '');
    text = text.replace(/<p>(<h[1-6]>)/g, '$1');
    text = text.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    text = text.replace(/<p>(<ul>|<ol>|<blockquote>|<hr>|<pre>)/g, '$1');
    text = text.replace(/(<\/ul>|<\/ol>|<\/blockquote>|<hr>|<\/pre>)<\/p>/g, '$1');

    return text;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show temporary feedback
        const copyBtns = document.querySelectorAll('.copy-btn');
        copyBtns.forEach(btn => {
            if (btn.textContent === 'Copy') {
                btn.textContent = 'Copied!';
                setTimeout(() => {
                    btn.textContent = 'Copy';
                }, 2000);
            }
        });
    });
}

function addMessage(role, content, timestamp = null) {
    const messagesContainer = document.getElementById('messages');

    // Remove welcome screen if it exists
    const welcomeScreen = messagesContainer.querySelector('.welcome-screen');
    if (welcomeScreen) {
        welcomeScreen.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = role === 'user' ? '👤' : '🤖';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';

    // Parse markdown for assistant messages
    if (role === 'assistant') {
        textDiv.innerHTML = parseMarkdown(content);

        // Add copy button for assistant messages
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.textContent = 'Copy';
        copyBtn.onclick = () => copyToClipboard(content);
        contentDiv.appendChild(copyBtn);
    } else {
        textDiv.textContent = content;
    }

    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = timestamp || getCurrentTime();

    contentDiv.appendChild(textDiv);
    contentDiv.appendChild(timeDiv);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);

    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

function showLoading() {
    const messagesContainer = document.getElementById('messages');

    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-message';
    loadingDiv.id = 'loading-message';

    const avatar = document.createElement('div');
    avatar.className = 'loading-avatar';
    avatar.textContent = '🤖';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'loading-content';

    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';

    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        typingDiv.appendChild(dot);
    }

    const textSpan = document.createElement('span');
    textSpan.textContent = 'Thinking...';
    textSpan.style.marginLeft = '10px';
    textSpan.style.color = '#999';
    textSpan.style.fontSize = '14px';

    contentDiv.appendChild(typingDiv);
    contentDiv.appendChild(textSpan);
    loadingDiv.appendChild(avatar);
    loadingDiv.appendChild(contentDiv);

    messagesContainer.appendChild(loadingDiv);
    scrollToBottom();
}

function hideLoading() {
    const loadingDiv = document.getElementById('loading-message');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();

    if (!message || isLoading || !conversationId) return;

    const timestamp = getCurrentTime();

    // Add user message
    addMessage('user', message, timestamp);

    // Clear input
    input.value = '';
    input.style.height = 'auto';

    // Set loading state
    isLoading = true;
    document.getElementById('sendButton').disabled = true;
    showLoading();
    hideError();

    try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                role: 'user',
                conversation_id: conversationId
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to send message');
        }

        const data = await response.json();

        // Hide loading and add assistant message
        hideLoading();
        addMessage('assistant', data.response, getCurrentTime());

    } catch (error) {
        hideLoading();
        console.error('Chat error:', error);
        showError(error.message || 'Something went wrong. Please try again.');
    } finally {
        isLoading = false;
        document.getElementById('sendButton').disabled = false;
        focusInput();
    }
}

function startNewConversation() {
    generateConversationId();

    const messagesContainer = document.getElementById('messages');
    messagesContainer.innerHTML = `
                <div class="welcome-screen">
                    <div class="welcome-icon">🤖</div>
                    <h3>Start a conversation</h3>
                    <p>Ask me anything! I'm here to help.</p>
                </div>
            `;

    hideError();
    focusInput();
}
