'use strict';

var blockElements = require('./block-elements');

module.exports = function (elm, data) {
  while (elm.childNodes.length) {
    elm.firstChild.parentNode.removeChild(elm.firstChild);
  }

  var newElm = document.createElement('div');
  newElm.setAttribute('contenteditable', 'true');
  elm.appendChild(newElm);

  blockElements(data, newElm);
};
