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
  }

  // Check if mod is downloaded and store it in storage
  chrome.storage.sync.get('downloadedMods', function(data) {
    let downloadedMods = data.downloadedMods || [];
    if (downloadedMods.includes(modName)) {
      return;
    }

    const downloadButton = document.querySelector('.download_link');
    if (downloadButton) {
      downloadButton.addEventListener('click', function() {
        downloadedMods.push(modName);
        chrome.storage.sync.set({downloadedMods: downloadedMods}, function() {
          console.log(`Saved downloaded mod: ${modName}`);
        });
      });
    }
  });

  // Check for updates to downloaded mods
  chrome.storage.sync.get('downloadedMods', function(data) {
    const downloadedMods = data.downloadedMods || [];
    if (downloadedMods.length === 0) {
      return;
    }

    for (const mod of downloadedMods) {
      const modUrl = `https://mods.factorio.com/mod/${mod}`;
      fetch(modUrl)
        .then(response => response.text())
        .then(data => {
          const html = new DOMParser().parseFromString(data, 'text/html');
          const releases = html.querySelectorAll('.releases tr.release-download-row');
          if (releases.length > 0) {
            const latestRelease = releases[0];
            const latestVersion = latestRelease.querySelector('.release-title a').textContent.trim();
            const downloadLink = latestRelease.querySelector('.download_link').getAttribute('href');
            const storedVersion = localStorage.getItem(mod);
            if (latestVersion !== storedVersion) {
              localStorage.setItem(mod, latestVersion);
              alert(`New version available for ${mod}: ${latestVersion}\nDownload link: ${downloadLink}`);
            }
          }
        })
        .catch(error => {
          console.error(`Error fetching mod ${mod}: ${error}`);
        });
    }
  });
})();
