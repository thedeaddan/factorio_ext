document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("download-btn").addEventListener("click", function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var modUrlMatch = tabs[0].url.match(/^https:\/\/mods\.factorio\.com\/mod\/([^\/]+)/);
      if (modUrlMatch) {
        var modName = modUrlMatch[1];
        chrome.tabs.create({url: "https://re146.dev/factorio/mods/ru#https://mods.factorio.com/mod/" + modName});
      }
    });
  });
});
