// ░█░█░█░█░█▀█░█▄█░█▀█░█▀▄░▀█▀
// ░█▀█░█▀▄░█▀█░█░█░█░█░█▀▄░░█░
// ░▀░▀░▀░▀░▀░▀░▀░▀░▀▀▀░▀░▀░▀▀▀             
// Name: app.js
// Description: Claude chatbot application using puter.js framework
// Author: hkamori | 0xhkamori.github.io
// # ----------------------------------------------
// 🔒    Licensed under the GNU AGPLv3
// 🌐 https://www.gnu.org/licenses/agpl-3.0.html
// ------------------------------------------------                               

let chatCounter = 1;
const messageInput = document.getElementById('messageInput');
const chatMessages = document.getElementById('chatMessages');
const chatList = document.getElementById('chatList');
const newChatBtn = document.getElementById('newChatBtn');
const codeContent = document.getElementById('codeContent');

newChatBtn.addEventListener('click', () => {
    chatCounter++;
    const chatItem = document.createElement('div');
    chatItem.className = 'chat-item';
    chatItem.dataset.chat = chatCounter;
    chatItem.innerHTML = `
        <span><i class="fas fa-comment-alt"></i> Chat ${chatCounter}</span>
        <span class="close-btn">&times;</span>
    `;
    chatList.appendChild(chatItem);
    
    clearMessages();
    addBotMessage("Hello! How can I help you with coding today?");
});

chatList.addEventListener('click', (e) => {
    const chatItem = e.target.closest('.chat-item');
    const closeBtn = e.target.closest('.close-btn');
    
    if (closeBtn) {
        if (chatList.children.length > 1) {
            chatItem.remove();
        }
        e.stopPropagation();
        return;
    }
    
    if (chatItem) {
        document.querySelectorAll('.chat-item').forEach(item => {
            item.classList.remove('active');
        });
        
        chatItem.classList.add('active');
        clearMessages();
        addBotMessage("Switched to a different chat. How can I help?");
    }
});

async function typeText(element, text) {
    element.classList.add('typing');
    let index = 0;
    while (index < text.length) {
        element.textContent = text.slice(0, index + 1);
        index++;
        await new Promise(resolve => setTimeout(resolve, 20));
    }
    element.classList.remove('typing');
}

function extractCode(text) {
    const codePatterns = [
        /```[\s\S]*?```/g,  // Code blocks
        /`.*?`/g,           // Inline code
        /function\s+\w+\s*\{[\s\S]*?\}/g,  // Function definitions
        /class\s+\w+\s*\{[\s\S]*?\}/g,     // Class definitions
        /const\s+\w+\s*=\s*function/g,      // Function expressions
        /import\s+.*?from/g,                // Import statements
        /export\s+default/g,                // Export statements
    ];

    for (const pattern of codePatterns) {
        const match = text.match(pattern);
        if (match) {
            return match[0].replace(/```/g, '').trim();
        }
    }
    return null;
}

messageInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const message = messageInput.value.trim();
        if (message) {
            addUserMessage(message);
            messageInput.value = '';

            try {
                const resp = await puter.ai.chat(message, { model: 'claude', stream: true });
                let fullResponse = '';
                
                const botMessageDiv = document.createElement('div');
                botMessageDiv.className = 'message bot-message';
                const typingDiv = document.createElement('div');
                typingDiv.className = 'typing-text';
                botMessageDiv.appendChild(typingDiv);
                chatMessages.appendChild(botMessageDiv);

                for await (const part of resp) {
                    if (part?.text) {
                        fullResponse += part.text;
                        typingDiv.textContent = fullResponse;
                        const code = extractCode(fullResponse);
                        if (code) {
                            codeContent.textContent = code;
                        }
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    }
                }
            } catch (error) {
                console.error('AI Error:', error);
                addBotMessage('Sorry, I encountered an error. Please try again.');
            }
        }
    }
});

function addUserMessage(text) {
    const message = document.createElement('div');
    message.className = 'message user-message';
    message.textContent = text;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addBotMessage(text) {
    const message = document.createElement('div');
    message.className = 'message bot-message';
    const typingText = document.createElement('div');
    typingText.className = 'typing-text';
    message.appendChild(typingText);
    chatMessages.appendChild(message);
    typeText(typingText, text);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function clearMessages() {
    chatMessages.innerHTML = '';
}

function detectLanguage(code) {
    if (!code || typeof code !== 'string') {
        return 'txt';
    }

    const firstLine = code.split('\n')[0].toLowerCase().trim();
    for (const language of Object.keys(languageExtensions)) {
        if (firstLine.includes(language)) {
            return language;
        }
    }

    return 'txt';
}

function downloadCode() {
    const codeContent = document.getElementById('codeContent').textContent;
    if (!codeContent || codeContent === '// Your code will appear here') {
        return;
    }

    const language = detectLanguage(codeContent);
    const extension = languageExtensions[language] || 'txt';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `code_${timestamp}.${extension}`;

    const blob = new Blob([codeContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function addDownloadButton() {
    const codeHeader = document.querySelector('.code-header');
    codeHeader.style.display = 'flex';
    codeHeader.style.justifyContent = 'space-between';
    codeHeader.style.alignItems = 'center';

    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'btn btn-sm btn-primary';
    downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
    downloadBtn.style.fontSize = '12px';
    downloadBtn.style.padding = '4px 8px';
    downloadBtn.addEventListener('click', downloadCode);

    codeHeader.appendChild(downloadBtn);
}

document.addEventListener('DOMContentLoaded', addDownloadButton);
