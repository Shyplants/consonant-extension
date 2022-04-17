// const resetSettings = {
//   'status': 'unloaded'
// };

// chrome.runtime.onInstalled.addListener((details) => {
//   if (details.reason === 'install') {
//       setData('settings', resetSettings);
//   }
// });

// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//   if (msg.action === "change") { 
//     fresh();
//     matching(msg.val);
//     dumpNode(Array.from(matchNode));
//     focusNode();

//     sendResponse({ cnt:nodeCnt, currentIndex:nodeIndex });
//   }

//   else if(msg.action === 'prevBtn') {
//     nodeIndex = Math.max(0, nodeIndex-1);

//     focusNode();
//     sendResponse({ cnt:nodeCnt, currentIndex:nodeIndex });
//   }

//   else if(msg.action === 'nextBtn') {
//     nodeIndex = Math.min(nodeCnt-1, nodeIndex+1);

//     focusNode();
//     sendResponse({ cnt:nodeCnt, currentIndex:nodeIndex });
//   }

//   return true;
// });

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if(msg.action === "getTab") {
    const tab = getCurrentTab();
    sendResponse({tabId : tab.id});
  }
});

function setData(key, value) {
  chrome.storage.sync.set({ [key]: value }, () => { console.log('ok') });
}