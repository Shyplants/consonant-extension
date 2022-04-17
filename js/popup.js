let tab;

function init() {
  [tab] = await chrome.tabs.query({ active: true, currentWindow: true});
}

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
  return (x < y ? x : y);
}

function createPrevButtonListener() {
  const prevBtn = document.querySelector('#prevBtn');

  prevBtn.addEventListener('click', () => {
    chrome.tabs.sendMessage(tab.id, {action: "prevBtn"}, (response) => {
      setCurrentIndex(min(response.current_index + 1, response.cnt));
    });
  })
}

function createNextButtonListener() {
  const nextBtn = document.querySelector('#nextBtn');

  nextBtn.addEventListener('click', () => {
    chrome.tabs.sendMessage(tab.id, {action: "nextBtn"}, (response) => {
      setCurrentIndex(min(response.current_index + 1, response.cnt));
    });
  })
}

function createSearchInputListener() {
  const searchInput = document.querySelector('#searchInput');
  const searchInputValue = getSearchInputValue();
  

  searchInput.addEventListener('change', () => {
    chrome.tabs.sendMessage(tab.id, {action: "change", val: searchInputValue}, (response) => {
      setTotalCount(response.cnt);
      setCurrentIndex(min(response.current_index + 1, response.cnt));
    });
  });
}


// $('#prev_btn').click(function() {
//   chrome.tabs.sendMessage(tab.id, {action: "prev_btn"}, (response) => {
//     $('#current').text(Math.min(response.current_index + 1, response.cnt));
//   });
// });

// $('#next_btn').click(function() {
//   chrome.tabs.sendMessage(tab.id, {action: "next_btn"}, (response) => {
//     $('#current').text(Math.min(response.current_index + 1, response.cnt));
//   });
// });

// $('#search_field').change(async function() {

//   chrome.tabs.sendMessage(tab.id, {action: "change", val: $('#search_field').val()}, (response) => {
//     $('#total').text(response.cnt);
//     $('#current').text(Math.min(response.current_index + 1, response.cnt));
//   });

// });


window.onload = () => {
  init();
  createPrevButtonListener();
  createNextButtonListener();
  createSearchInputListener();
}