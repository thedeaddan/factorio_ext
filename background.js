// Функция для сохранения информации о скачанных модах
function saveDownloadedMod(modName, version) {
  chrome.storage.local.get('downloadedMods', function(data) {
    const downloadedMods = data.downloadedMods || {};
    downloadedMods[modName] = version;
    chrome.storage.local.set({ downloadedMods });
  });
}

// Функция для проверки наличия обновлений для конкретного мода
function checkModUpdate(modName) {
  const modPageUrl = `https://mods.factorio.com/mod/${modName}`;
  fetch(modPageUrl)
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const versionElement = doc.querySelector('.mod-info-version');
      if (versionElement) {
        const version = versionElement.textContent.trim();
        chrome.storage.local.get('downloadedMods', function(data) {
          const downloadedMods = data.downloadedMods || {};
          const downloadedVersion = downloadedMods[modName];
          if (downloadedVersion && downloadedVersion !== version) {
            // Оповещаем пользователя о наличии обновления
            const notificationId = `mod-update-${modName}`;
            chrome.notifications.create(notificationId, {
              type: 'basic',
              iconUrl: 'icon.png',
              title: 'Обновление мода',
              message: `Для мода ${modName} доступно обновление до версии ${version}!`,
            });
          }
        });
      }
    })
    .catch(error => console.error(error));
}

// Функция для проверки наличия обновлений для всех скачанных модов
function checkAllModUpdates() {
  chrome.storage.local.get('downloadedMods', function(data) {
    const downloadedMods = data.downloadedMods || {};
    Object.keys(downloadedMods).forEach(modName => checkModUpdate(modName));
  });
}

// Вызываем функцию проверки обновлений каждые 24 часа
setInterval(checkAllModUpdates, 24 * 60 * 60 * 1000);
