// ░█░█░█░█░█▀█░█▄█░█▀█░█▀▄░▀█▀
// ░█▀█░█▀▄░█▀█░█░█░█░█░█▀▄░░█░
// ░▀░▀░▀░▀░▀░▀░▀░▀░▀▀▀░▀░▀░▀▀▀             
// Name: animatedTitle.js
// Description: Animate the browser title using an array of strings
// Author: hkamori | 0xhkamori.github.io
// ----------------------------------------------
// 🔒    Licensed under the GNU AGPLv3
// 🌐 https://www.gnu.org/licenses/agpl-3.0.html
// ------------------------------------------------    

const titles = [
    "🌊 C",
    "🌊 Cl",
    "🌊 Cla",
    "🌊 Clau",
    "🌊 Claud",
    "🌊 Claude",
    "🌊 Claude F",
    "🌊 Claude Fr",
    "🌊 Claude Fre",
    "🌊 Claude Free",
    "🌊 Claude Free",
    "🌊 Claude Fre",
    "🌊 Claude Fr",
    "🌊 Claude F",
    "🌊 Claude",
    "🌊 Claud",
    "🌊 Clau",
    "🌊 Cla",
    "🌊 Cl",
    "🌊 C",
];

let currentIndex = 0;

function animateTitle() {
    document.title = titles[currentIndex];
    currentIndex = (currentIndex + 1) % titles.length;
}

setInterval(animateTitle, 250);