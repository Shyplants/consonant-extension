function setCurrentIndex(index) {
  let currentIndex = document.querySelector('#current');
  currentIndex.innerText = index
}

function setTotalCount(val) {
  let total = document.querySelector('#total');
  total.innerText = val;
}

function getSearchInputValue() {
  const searchInput = document.querySelector('#searchInput');
  return searchInput.value;
}

function min(x, y) {
  x = Number(x);
  y = Number(y);
  return (x < y ? x : y);
}

function createPrevButtonListener() {
  const prevBtn = document.querySelector('#prevBtn');

  prevBtn.addEventListener('click', () => {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'prevBtn'}, (response) => {
        setCurrentIndex(min(response.current_index + 1, response.cnt));
      });
    });
  })
}

function createNextButtonListener() {
  const nextBtn = document.querySelector('#nextBtn');

  nextBtn.addEventListener('click', () => {

    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'nextBtn'}, (response) => {
        setCurrentIndex(min(response.current_index + 1, response.cnt));
      });
    });

  })
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

window.onload = () => {
  createPrevButtonListener();
  createNextButtonListener();
  createSearchInputListener();
}