const resetSettings = {
  'status': 'unloaded'
};

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
      setData('settings', resetSettings);
  }
});

function setData(key, value) {
  chrome.storage.sync.set({ [key]: value }, () => { console.log('ok') });
}