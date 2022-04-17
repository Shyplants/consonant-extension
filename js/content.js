window.onload = () => {
  let nodeIndex, nodeCnt;
  let firstChar = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  let bodyText, matchNode, retNode;

  (function init() {
    nodeIndex = 0;
    nodeCnt = 0;
    bodyText = document.body.innerText.split(/\s/g);
  })()

  fresh = () => {
    let element = document.getElementById('highLight');
  
    while(element) {
      let htmlText = element.outerHTML.toString();
      htmlText = htmlText.replace(/(<([^>]+)>)/ig,"");
      element.outerHTML = htmlText;

      element = document.getElementById('highLight');
    }
  }

  matching = (initals) => {
    matchNode = new Set();
    
    getConsonant = (char) => {
      let index = Math.floor((char.charCodeAt() - 44032) / 588);
    
      return firstChar[index];
    }

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

  dumpNode = (pattern) => {
    const head = `<span id="highLight">`;
    const tail = `</span>`;
    let nodeSet = new Set();

    searchNode = (element, pattern) => {  
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
    nodeIndex = 0;
  }

  focusNode = () => {
    if(nodeCnt == 0) return;

    retNode[nodeIndex].scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
  }
    
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log('enter2');
    if (msg.action === "change") { 
      console.log('B: ' + msg.val);
      fresh();
      matching(msg.val);
      dumpNode(Array.from(matchNode));
      focusNode();

      sendResponse({ cnt:nodeCnt, currentIndex:nodeIndex });
    }

    else if(msg.action === 'prevBtn') {
      nodeIndex = Math.max(0, nodeIndex-1);

      focusNode();
      sendResponse({ cnt:nodeCnt, currentIndex:nodeIndex });
    }

    else if(msg.action === 'nextBtn') {
      nodeIndex = Math.min(nodeCnt-1, nodeIndex+1);

      focusNode();
      sendResponse({ cnt:nodeCnt, currentIndex:nodeIndex });
    }

    return true;
  });

}