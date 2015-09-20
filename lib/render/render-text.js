'use strict';

module.exports = function renderText (obj, elm) {
  var child = document.createTextNode(obj.content);

  if (obj.href) {
    child = wrap('a', child);
    child.href = obj.href;
  }

  if (obj.italic) {
    child = wrap('em', child);
  }

  if (obj.bold) {
    child = wrap('strong', child);
  }

  elm.appendChild(child);
};

function wrap (nodeName, child) {
  var newElm = document.createElement(nodeName);
  newElm.appendChild(child);
  return newElm;
}
