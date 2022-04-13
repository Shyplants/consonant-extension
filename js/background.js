chrome.runtime.onInstalled.addListener(() => {
  // default state goes here
  // this runs ONE TIME ONLY (unless the user reinstalls your extension)
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if(changeInfo.status === 'complete' && /^http/.test(tab.url)) { // broswer 시작할때
    
    // chrome.scripting.insertCSS({
    //   target: { tabId: tab.id },
    //   files: ["./css/foreground_styles.css"]
    // })
    // .then(() => {
    //   chrome.scripting.executeScript({
    //     target: { tabId: tab.id },
    //     files: ["./js/content_script.js"]
    //   })
    // })
    // .catch(err => console.log(err));
  }
});

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  
// });


