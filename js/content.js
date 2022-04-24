let current_index, nodeCnt;
let bodyText, matchNode, retNode, nodeSet;
let firstChar = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

function init() {
  current_index = 0;
  nodeCnt = 0;
  bodyText = document.body.innerText.split(/\s/g);
}

function fresh() {
  let element = document.getElementById('highLight');
  
  while(element) {
    let htmlText = element.outerHTML.toString();
    htmlText = htmlText.replace(/(<([^>]+)>)/ig,"");
    element.outerHTML = htmlText;

    element = document.getElementById('highLight');
  }
}

function getConsonant(char) {
  let index = Math.floor((char.charCodeAt() - 44032) / 588);
  
  return firstChar[index];
}

function matching(initals) {
  matchNode = new Set();

  for(let i = 0; i < bodyText.length; ++i) {
    if(bodyText[i].length < initals.length) continue;

    let flag = true;
    for(let j = 0; j < initals.length; ++j) {
      if(initals[j] != getConsonant(bodyText[i][j])) {
        flag = false;
        break;
      }
    }

    if(flag) {
      matchNode.add(bodyText[i].slice(0, initals.length));
    }
  }
}

function searchNode(element, pattern) {  
  for(let node of element.childNodes) {
    switch(node.nodeType) {
      case Node.DOCUMENT_NODE:
        searchNode(node, pattern);
        break;

      case Node.ELEMENT_NODE:
        searchNode(node, pattern);
        break;
        
      case Node.TEXT_NODE:
        for(let word of pattern) {
          let textIndex = String(node.textContent).indexOf(word);
          if(textIndex != -1) {
            nodeSet.add(node.parentNode);
          }
        }
        searchNode(node, pattern);
        break;
        
      default:
        break;
    }
  }
}

function dumpNode(pattern) {
  const head = `<span id="highLight">`;
  const tail = `</span>`;
  nodeSet = new Set();

  searchNode(document.body, pattern);

  nodeSet.forEach(function(node){
    if(node.offsetParent === null)
      nodeSet.delete(node);
  })
  
  for(let node of nodeSet) {
    for(let word of pattern) {
      let textIndex = String(node.textContent).indexOf(word);
      let htmlIndex = -1;
      while(textIndex != -1) {
        htmlIndex = String(node.innerHTML).indexOf(word, htmlIndex + 1);

        let before = node.innerHTML;
        let after = before.slice(0, htmlIndex) + head + word + tail + before.slice(htmlIndex + word.length);
        node.innerHTML = after;

        textIndex = String(node.textContent).indexOf(word, textIndex + head.length + tail.length + 1);
        htmlIndex += head.length+tail.length;
      }
    }
  }
  
  nodeCnt = nodeSet.size;
  retNode = Array.from(nodeSet);
  current_index = 0;
}

function focusNode() {
  if(nodeCnt == 0) return;

  retNode[current_index].scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
}

function createSearchInputListener() {
  const searchInput = document.querySelector('#searchInput');
  
  searchInput.addEventListener('change', () => {
    const searchInputValue = getSearchInputValue();

    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'change', val: searchInputValue}, (response) => {
        setTotalCount(response.cnt);
        setCurrentIndex(min(response.current_index + 1, response.cnt));
      });
    });
  });
}

function createMessageListener() {
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === 'change') { 
      console.log('check');
      fresh();
      matching(msg.val);
      dumpNode(Array.from(matchNode));
      focusNode();
      
      sendResponse({ cnt:nodeCnt, current_index:current_index });
    }

    else if(msg.action === 'prevBtn') {
      current_index = Math.max(0, current_index-1);

      focusNode();
      sendResponse({ cnt:nodeCnt, current_index:current_index });
    }

    else if(msg.action === 'nextBtn') {
      current_index = Math.min(nodeCnt-1, current_index+1);

      focusNode();
      sendResponse({ cnt:nodeCnt, current_index:current_index });
    }

    return true;
  });
}


window.onload = () => {
  init();
  createMessageListener();
}