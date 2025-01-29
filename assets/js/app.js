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
                let isInCodeBlock = false;
                let currentCodeBlock = '';
                let codeBlockFound = false;

                const botMessageDiv = document.createElement('div');
                botMessageDiv.className = 'message bot-message';
                const typingDiv = document.createElement('div');
                typingDiv.className = 'typing-text';
                botMessageDiv.appendChild(typingDiv);
                chatMessages.appendChild(botMessageDiv);

                for await (const part of resp) {
                    if (part?.text) {
                        const text = part.text;
                        let textToProcess = text;

                        while (textToProcess.length > 0) {
                            if (!isInCodeBlock) {
                                const codeStart = textToProcess.indexOf('```');
                                if (codeStart !== -1 && !codeBlockFound) {
                                    const beforeCode = textToProcess.substring(0, codeStart);
                                    fullResponse += beforeCode;
                                    typingDiv.textContent = fullResponse;
                                    const codeBadge = document.createElement('span');
                                    codeBadge.className = 'code-badge btn btn-dark shadow';
                                    codeBadge.textContent = '</>Code';
                                    typingDiv.appendChild(codeBadge);
                                    isInCodeBlock = true;
                                    codeBlockFound = true;
                                    textToProcess = textToProcess.substring(codeStart + 3);
                                    currentCodeBlock = '';
                                    // Ignore the first line of code
                                    const newlineIndex = textToProcess.indexOf('\n');
                                    if (newlineIndex !== -1) {
                                        textToProcess = textToProcess.substring(newlineIndex + 1);
                                    }
                                } else {
                                    fullResponse += textToProcess;
                                    typingDiv.textContent = fullResponse;
                                    textToProcess = '';
                                }
                            } else {
                                const codeEnd = textToProcess.indexOf('```');
                                if (codeEnd !== -1) {
                                    currentCodeBlock += textToProcess.substring(0, codeEnd);
                                    codeContent.textContent = currentCodeBlock;
                                    isInCodeBlock = false;
                                    textToProcess = textToProcess.substring(codeEnd + 3);
                                } else {
                                    currentCodeBlock += textToProcess;
                                    codeContent.textContent = currentCodeBlock;
                                    textToProcess = '';
                                }
                            }
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

const languageExtensions = {
    javascript: 'js',
    python: 'py',
    java: 'java',
    cpp: 'cpp',
    'c++': 'cpp',
    c: 'c',
    ruby: 'rb',
    php: 'php',
    html: 'html',
    css: 'css',
    typescript: 'ts',
    rust: 'rs',
    go: 'go',
    swift: 'swift',
    kotlin: 'kt',
    sql: 'sql',
    scala: 'scala',
    perl: 'pl',
    lua: 'lua',
    r: 'r',
    matlab: 'm',
    shell: 'sh',
    powershell: 'ps1',
    csharp: 'cs',
    fsharp: 'fs',
    dart: 'dart',
    groovy: 'groovy',
    haskell: 'hs',
    julia: 'jl',
    markdown: 'md',
    xml: 'xml',
    yaml: 'yml',
    json: 'json',
    dockerfile: 'dockerfile',
    elixir: 'ex',
    erlang: 'erl',
    fortran: 'f90',
    pascal: 'pas',
    prolog: 'pl',
    scheme: 'scm',
    vb: 'vb',
    assembly: 'asm',
    sass: 'scss',
    less: 'less',
    latex: 'tex',
    verilog: 'v',
    vhdl: 'vhd',
    graphql: 'graphql',
    toml: 'toml',
    ini: 'ini'
};

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
