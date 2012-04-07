(function(){
/**
 * Injection code inspired by https://github.com/mohamedmansour/extended-share-extension
 */

var CONTENT_PANE_ID = '#contentPane';
var STREAM_UPDATE_SELECTOR = 'div[id^="update"]';
var PUBLIC_POST_SELECTOR = '.ERIVId';

function onContentModified(e) {
  // This happens when a new stream is selected
  if (e.relatedNode && e.relatedNode.parentNode && e.relatedNode.parentNode.id == 'contentPane') {
    // We're only interested in the insertion of entire content pane
    processAllItems(e.target);
  } else if (e.target.nodeType == Node.ELEMENT_NODE && e.target.id.indexOf('update') == 0) {
    processPost(e.target);
  }
};

/**
 * Process
 */
function processAllItems(subtreeDOM) {
  var posts = (typeof subtreeDOM == 'undefined') ?
      document.querySelectorAll(STREAM_UPDATE_SELECTOR) :
      subtreeDOM.querySelectorAll(STREAM_UPDATE_SELECTOR);
  for (var i = 0; i < posts.length; i++) {
    processPost(posts[i]);
  }
}

function processPost(itemDOM) {
  if (itemDOM && itemDOM.querySelector(PUBLIC_POST_SELECTOR)) {
    if (localStorage['enable'] == '1') {
      itemDOM.style.visibility = 'hidden';
      itemDOM.style.display = 'none';
    } else {
      itemDOM.style.visibility = null;
      itemDOM.style.display = null;
    }
  }
};

function onChange(event) {
  var value = event.srcElement.checked;
  localStorage['enable'] = value ? '1' : '0';
  processAllItems();
  chrome.extension.sendRequest({personalize: value}, function(){});
}

document.addEventListener("DOMContentLoaded", function() {
  // Insert checkbox.
  var stream = document.querySelector('[asrc=streamnav]');
  if (stream) {
    var isEnabled = localStorage['enable'] == '1';
    var controlBox = document.createElement('input');
    controlBox.type = 'checkbox';
    controlBox.onchange = onChange;
    controlBox.id = 'tz_personalize_enable';
    if (isEnabled) {
      controlBox.setAttribute('checked', true);
    }
    var label = document.createElement('label');
    label.setAttribute('for', controlBox.id);
    label.innerText = 'Personalize';
    var parent = stream.parentElement;
    parent.insertBefore(label, parent.children[1]);
    parent.insertBefore(controlBox, label);
  }

  // Listen when the subtree is modified for new posts.
  var googlePlusContentPane = document.querySelector(CONTENT_PANE_ID);
  if (googlePlusContentPane) {
    googlePlusContentPane.addEventListener('DOMNodeInserted', onContentModified);
    processAllItems(googlePlusContentPane);
  }
});
})();
