'use strct';

module.exports = function (elm) {
  var selection = window.getSelection();

  if (selection.rangeCount === 0) {
    return;
  }

  var range = window.getSelection().getRangeAt(0);

  var startContainer = range.startContainer;
  if (!elm.contains(startContainer)) {
    return;
  }

  var startMarker = document.createElement('span');
  startMarker.className = 'selection-marker-start';
  var endMarker = document.createElement('span');
  endMarker.className = 'selection-marker-end';

  var copy = range.cloneRange();
  copy.collapse(true);
  copy.insertNode(startMarker);

  copy = range.cloneRange();
  copy.collapse(false);
  copy.insertNode(endMarker);
};
