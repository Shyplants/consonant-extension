let tab;


(async function init() {
  [tab] = await chrome.tabs.query({ active: true, currentWindow: true});
})()


$('#prev_btn').click(function() {
  chrome.tabs.sendMessage(tab.id, {action: "prev_btn"}, (response) => {
    $('#current').text(Math.min(response.current_index + 1, response.cnt));
  });
});

$('#next_btn').click(function() {
  chrome.tabs.sendMessage(tab.id, {action: "next_btn"}, (response) => {
    $('#current').text(Math.min(response.current_index + 1, response.cnt));
  });
});

$('#search_field').change(async function() {

  chrome.tabs.sendMessage(tab.id, {action: "change", val: $('#search_field').val()}, (response) => {
    $('#total').text(response.cnt);
    $('#current').text(Math.min(response.current_index + 1, response.cnt));
  });

  // chrome.tabs.sendMessage(tab.id, {action: "matching", val: $('#search_field').val()} /* callback */);

  // let pattern = await chrome.scripting.executeScript(
  // {
  //   target: { tabId: tab.id },
  //   function: matching,
  //   args: [$('#search_field').val()],
  // });
  // pattern = pattern[0].result;
  
  // let patternElement = await chrome.scripting.executeScript(
  // {
  //   target: { tabId: tab.id },
  //   function: dumpNode,
  //   args: [pattern],
  // });
  // nodeCnt = Number(patternElement[0].result);

  // $('#total').text(nodeCnt);
  // $('#current').text(nodeCnt === 0 ? 0 : 1);

  // chrome.scripting.executeScript(
  // {
  //   target: { tabId: tab.id },
  //   function: focusNode,
  //   args: [nodeCnt, nodeIndex],
  // });

});

// async function dumpNode(pattern) {
//   const head = `<span id="highLight">`;
//   const tail = `</span>`;
//   let nodeSet = new Set();
//   function searchNode(element, pattern){    
//     for(let node of element.childNodes) {
//       switch(node.nodeType) {
//         case Node.DOCUMENT_NODE:
//           searchNode(node, pattern);
//           break;

//         case Node.ELEMENT_NODE:
//           searchNode(node, pattern);
//           break;
          
//         case Node.TEXT_NODE:
//           for(let word of pattern) {
//             let textIndex = String(node.textContent).indexOf(word);
//             if(textIndex != -1) {
//               nodeSet.add(node.parentNode);
//             }
//           }
//           searchNode(node, pattern);
//           break;
          

//         default:
//           break;
//       }
//     }  
//   }

//   searchNode(document.body, pattern);

//   nodeSet.forEach(function(node){
//     if(node.offsetParent === null)
//       nodeSet.delete(node);
//   })
  
//   for(let node of nodeSet) {
//     for(let word of pattern) {
//       let textIndex = String(node.textContent).indexOf(word);
//       let htmlIndex = -1;
//       while(textIndex != -1) {
//         htmlIndex = String(node.innerHTML).indexOf(word, htmlIndex + 1);

//         let before = node.innerHTML;
//         let after = before.slice(0, htmlIndex) + head + word + tail + before.slice(htmlIndex + word.length);
//         node.innerHTML = after;

//         textIndex = String(node.textContent).indexOf(word, textIndex + head.length + tail.length + 1);
//         htmlIndex += head.length+tail.length;
//       }
//     }
//   }

//   return nodeSet.size;
// }

// async function matching(initals){
//   const firstChar = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
//   let bodyText;
//   let match = new Set();

//   function getConsonant(char){
//     let index = Math.floor((char.charCodeAt() - 44032) / 588);
  
//     return firstChar[index];
//   }

//   async function load() {
//     return document.body.innerText.split(/\s/g);
//   }

//   const loadPromise = load();
//   bodyText = await loadPromise;

//   for(let i = 0; i < bodyText.length; ++i) {
//     if(bodyText[i].length < initals.length) continue;

//     let flag = true;
//     for(let j = 0; j < initals.length; ++j) {
//       if(initals[j] != getConsonant(bodyText[i][j])) {
//         flag = false;
//         break;
//       }
//     }

//     if(flag) {
//       match.add(bodyText[i].slice(0, initals.length));
//     }
//   }
//   return Array.from(match);
// }

// async function focusNode(cnt, index){
//   if(cnt === 0) return false;
//   async function select() {
//     let ret = document.querySelectorAll('#highLight');
//     let iframe = document.querySelectorAll('iframe');
//     for(let innerDoc of iframe) {
//       innerList = innerDoc.contentDocument.querySelectorAll('#highLight');

//       for(let i = 0; i<innerList.length; ++i) {
//         console.log(i);
//         ret.appendChild(innerList[i]);
//       }
//       for(let innerRet of innerList) {

//         console.log(innerRet);
//         // ret.appendChild(innerRet);
//       }
//       // ret.appendChild(innerDoc.contentDocument.querySelectorAll('#highLight'));
//       // ret += innerDoc.contentDocument.querySelectorAll('#highLight');
//     }

//     return ret;
//   }

//   const selectPromise = select();
//   let nodeList = await selectPromise;

  
//   nodeList[index].scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
//   return true;
// }