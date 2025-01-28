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
    const patterns = {
        csharp: /(?:using\s+System[;.]|namespace\s+[\w.]+|public\s+class\s+\w+|Console\.|async\s+Task|string\[\]|int\[\]|List<|Dictionary<|IEnumerable<)/,
        javascript: /(?:const|let|var|function|=>|\bimport\b|\bexport\b|require\()/,
        python: /(?:def|import|from|class|\bif __name__ == "__main__":|print\()/,
        java: /(?:public class|void main|System\.out|import java)/,
        cpp: /(?:#include|std::|cout|cin|void main)/,
        c: /(?:#include <[^>]+>|printf|scanf|malloc|void main)/,
        ruby: /(?:def|require|puts|gem|attr_accessor)/,
        php: /(?:<\?php|\$[a-zA-Z_]|echo|namespace)/,
        html: /(?:<html|<!DOCTYPE html|<head|<body|<script|<style)/,
        css: /(?:@media|@keyframes|\{|\}|margin:|padding:|color:)/,
        typescript: /(?:interface|type [A-Z]|extends|implements)/,
        rust: /(?:fn main|let mut|impl|pub struct)/,
        go: /(?:func main|package main|import \(|fmt\.)/,
        swift: /(?:var|let|func|class|import Foundation)/,
        kotlin: /(?:fun main|val|var|class|package)/,
        sql: /(?:SELECT|INSERT INTO|CREATE TABLE|UPDATE|DELETE FROM)/i,
        scala: /(?:object|def|val|var|trait|extends)/,
        perl: /(?:use strict|my \$|print|package|sub)/,
        lua: /(?:function|local|require|end|then)/,
        r: /(?:library|data\.frame|ggplot|<-|function\()/,
        matlab: /(?:function|end|plot|figure|matlab)/i,
        shell: /(?:(?:^|\n)#!\/bin\/|echo|export|source|alias)/,
        powershell: /(?:Write-Host|Get-|Set-|New-|Remove-)/,
        fsharp: /(?:let|module|type|member|printfn)/,
        dart: /(?:void main|Widget|BuildContext|setState)/,
        groovy: /(?:def|class|extends|implements|package)/,
        haskell: /(?:module|where|data|type|import)/,
        julia: /(?:function|end|println|using|module)/,
        markdown: /(?:^#+ |^\* |\[.+?\]\(.+?\)|^```)/m,
        xml: /(?:<\?xml|<!DOCTYPE|<(?:[a-z]+:)?[a-z]+>)/i,
        yaml: /(?:^---|\w+:\s|^-\s)/m,
        json: /(?:\{|\[)[\s\n]*(?:"[\w\s]+"\s*:)/,
        dockerfile: /(?:FROM|RUN|COPY|ADD|EXPOSE|ENV)/,
        elixir: /(?:defmodule|def|do|end|import)/,
        erlang: /(?:-module|-export|spawn|receive|fun)/,
        fortran: /(?:PROGRAM|SUBROUTINE|INTEGER|REAL|END)/i,
        pascal: /(?:program|begin|end|var|procedure)/i,
        prolog: /(?::-|consult|assert|retract|fail)/,
        scheme: /(?:\(define|\(lambda|\(let|\(cond)/,
        vb: /(?:Dim|Private|Public|Class|End)/i,
        assembly: /(?:section|global|mov|push|pop)/i,
        sass: /(?:@mixin|@include|@extend|@import|\$[a-z])/,
        less: /(?:@variable|@import|@media|@\{)/,
        latex: /(?:\\documentclass|\\begin|\\end|\\usepackage)/,
        verilog: /(?:module|endmodule|always|initial|wire|reg)/,
        vhdl: /(?:entity|architecture|process|signal|begin)/i,
        graphql: /(?:type|query|mutation|interface|input)/,
        toml: /(?:\[\w+\]|\w+ = )/,
        ini: /(?:\[\w+\]|\w+=)/
    };

    if (/^\ufffd\ufffd/.test(code)) {
        return 'bin';
    }

    const shebangMatch = code.match(/^#!\s*(.+)/);
    if (shebangMatch) {
        const shebang = shebangMatch[1].toLowerCase();
        if (shebang.includes('node')) return 'javascript';
        if (shebang.includes('python')) return 'python';
        if (shebang.includes('ruby')) return 'ruby';
        if (shebang.includes('perl')) return 'perl';
        if (shebang.includes('php')) return 'php';
        return 'shell';
    }

    const headerComment = code.trim().slice(0, 100).toLowerCase();
    if (headerComment.includes('<?xml')) return 'xml';
    if (headerComment.includes('<!doctype html')) return 'html';

    for (const [language, pattern] of Object.entries(patterns)) {
        if (pattern.test(code)) {
            return language;
        }
    }
    
    if (code.trim().startsWith('{') && /^\s*\{[\s\n]*"/.test(code)) return 'json';
    if (code.trim().startsWith('---') && /:[\s\n]/.test(code)) return 'yaml';
    
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
