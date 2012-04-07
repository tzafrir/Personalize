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
    if (localStorage['enable'] == 1 || true) {
      itemDOM.style.visibility = 'hidden';
      itemDOM.style.display = 'none';
    } else {
      itemDOM.style.visibility = null;
      itemDOM.style.display = null;
    }
  }
};

document.addEventListener("DOMContentLoaded", function() {
  // Listen when the subtree is modified for new posts.
  var googlePlusContentPane = document.querySelector(CONTENT_PANE_ID);
  if (googlePlusContentPane) {
    googlePlusContentPane.addEventListener('DOMNodeInserted', onContentModified);
    processAllItems(googlePlusContentPane);
  }
});
})();
