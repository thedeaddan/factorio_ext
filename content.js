(function() {
    'use strict';

    const modUrlMatch = location.href.match(/^https:\/\/mods\.factorio\.com\/mod\/([^\/]+)/);
    if (!modUrlMatch) {
        return;
    }
    const modName = modUrlMatch[1];

    const buttons = document.getElementsByClassName('button-green');
    for (const button of buttons) {
        if (button.innerText.trim() !== 'Download') {
            continue;
        }
        if (!button.getAttribute('href').startsWith('/login?next=')) {
            continue;
        }
        if (button.parentElement.tagName === 'DIV') {
            button.innerText = 'Download from re146.dev';
            button.setAttribute('target', '_blank');
            button.setAttribute('href', `https://re146.dev/factorio/mods/ru#https://mods.factorio.com/mod/${modName}`);
        } else if (button.parentElement.tagName === 'TD') {
            button.innerText = 'Download from re146.dev';
            button.setAttribute('target', '_blank');
            const version = button.parentElement.parentElement.children[0].innerText;
            button.setAttribute('href', `https://re146.dev/factorio/mods/ru#https://mods.factorio.com/mod/${modName}#${version}`);
        }
        button.classList.add('my-button');
        button.style.backgroundColor = '#4CAF50';
        button.style.border = 'none';
        button.style.color = 'white';
        button.style.padding = '8px 16px';
        button.style.textAlign = 'center';
        button.style.textDecoration = 'none';
        button.style.display = 'inline-block';
        button.style.fontSize = '16px';
        button.style.margin = '4px 2px';
        button.style.cursor = 'pointer';
    }
})();
