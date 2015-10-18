module.exports = function (elm) {
  const selection = window.getSelection();

  if (selection.rangeCount === 0) {
    return;
  }

  const range = selection.getRangeAt(0);

  const startContainer = range.startContainer;
  if (!elm.contains(startContainer)) {
    return;
  }

  const startMarker = document.createElement('span');
  startMarker.className = 'selection-marker-start';
  const endMarker = document.createElement('span');
  endMarker.className = 'selection-marker-end';

  let copy = range.cloneRange();
  copy.collapse(true);
  copy.insertNode(startMarker);

  copy = range.cloneRange();
  copy.collapse(false);
  copy.insertNode(endMarker);
};
