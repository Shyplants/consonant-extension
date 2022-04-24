// async function getCurrentTab() {
//   let queryOptions = { active: true, currentWindow: true };
//   let [tab] = await chrome.tabs.query(queryOptions);
//   return tab;
// }

// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//   if(msg.action === "getTab") {
//     const tab = getCurrentTab();
//     sendResponse({tabId : tab.id});
//   }
// });

// function setData(key, value) {
//   chrome.storage.sync.set({ [key]: value }, () => { console.log('ok') });
// }