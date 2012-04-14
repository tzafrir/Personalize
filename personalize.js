(function(){
/**
 * Injection code inspired by https://github.com/mohamedmansour/extended-share-extension
 */

var CONTENT_PANE_ID = '#contentPane';
var STREAM_UPDATE_SELECTOR = 'div[id^="update"]';
var PUBLIC_POST_SELECTOR = '.ERIVId';

var STATIC_CSS = "background-attachment: scroll;" +
"background-clip: border-box;" +
"background-color: " +
"whiteSmoke;" +
"background-image: -webkit-linear-gradient(top, " +
"whiteSmoke, " +
"#F1F1F1);" +
"background-origin: padding-box;" +
"border: 1px solid rgba(0, 0, 0, 0.0976563);" +
"border-radius: 2px;" +
"color: #444;" +
"cursor: default;" +
"display: inline-block;" +
"font-family: arial, sans-serif;" +
"font-size: 11px;" +
"font-style: normal;" +
"font-variant: normal;" +
"font-weight: bold;" +
"height: 27px;" +
"line-height: 27px;" +
"margin-bottom: 0px;" +
"margin-left: 10px;" +
"margin-right: 0px;" +
"margin-top: 0px;" +
"max-width: 120px;" +
"min-width: 34px;" +
"outline-color: #444;" +
"outline-style: none;" +
"outline-width: 0px;" +
"overflow-x: hidden;" +
"overflow-y: hidden;" +
"padding-bottom: 0px;" +
"padding-left: 21px;" +
"padding-right: 12px;" +
"padding-top: 0px;" +
"position: relative;" +
"text-align: center;" +
"text-overflow: ellipsis;" +
"vertical-align: middle;" +
"visibility: visible;" +
"white-space: nowrap;" +
"z-index: 3;";

var enabled = false;
var lastEnabled = false;
var buttonExists = false;

function onNodeInserted(e) {
  // This happens when a new stream is selected
  if (e.relatedNode && e.relatedNode.parentNode && e.relatedNode.parentNode.id == 'contentPane') {
    // We're only interested in the insertion of entire content pane
    processAllItems(e.target);
  } else if (e.target.nodeType == Node.ELEMENT_NODE && e.target.id.indexOf('update') == 0) {
    processPost(e.target);
  }
};

function addPersonalizeButtonIfNeeded() {
  var firstButton = document.querySelector('[data-dest=stream]:first-child:not([tz_personalize])');
  if (!firstButton) {
    return;
  }
  firstButton.setAttribute('tz_personalize', true);

  var button = document.createElement('div');
  button.id = 'tz_personalizeButton';
  button.style.cssText = STATIC_CSS;

  var controlBox = document.createElement('input');
  controlBox.type = 'checkbox';
  controlBox.onchange = onPersonalizeStateChange;
  controlBox.id = 'tz_personalize_enable';
  controlBox.style.cssText = 'position:absolute;top:3px;left:0px';
  if (enabled) {
    controlBox.setAttribute('checked', true);
  }
  var label = document.createElement('label');
  label.setAttribute('for', controlBox.id);

  button.appendChild(controlBox);
  button.appendChild(document.createTextNode('Personalize'));
  label.appendChild(button);
  firstButton.parentElement.parentElement.appendChild(label);
  buttonExists = true;
}

/**
 * Process
 */
function processAllItems(subtreeDOM) {
  if (!buttonExists) {
    addPersonalizeButtonIfNeeded();
  }
  if (lastEnabled == enabled) {
    return;
  }
  lastEnabled = enabled;
  var document.querySelectorAll(STREAM_UPDATE_SELECTOR);
  for (var i = 0; i < posts.length; i++) {
    processPost(posts[i]);
  }
}

function processPost(itemDOM) {
  if (itemDOM && itemDOM.querySelector(PUBLIC_POST_SELECTOR)) {
    if (enabled) {
      itemDOM.style.visibility = 'hidden';
      itemDOM.style.display = 'none';
    } else {
      itemDOM.style.visibility = null;
      itemDOM.style.display = null;
    }
  }
};

function onPersonalizeStateChange(event) {
  var value = event.srcElement.checked;
  enabled = !!value;
  processAllItems();
  chrome.extension.sendRequest({personalize: value}, function(){});
}

document.addEventListener("DOMContentLoaded", function() {
  // Listen when the subtree is modified for new posts.
  var googlePlusContentPane = document.querySelector(CONTENT_PANE_ID);
  if (googlePlusContentPane) {
    googlePlusContentPane.addEventListener('DOMNodeInserted', onNodeInserted);
    googlePlusContentPane.addEventListener('DOMSubtreeModified', processAllItems);
    processAllItems();
  }
});
})();
