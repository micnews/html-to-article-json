'use strict';

var blockElements = require('./block-elements');

module.exports = function (elm, nodes, ids) {
  while (elm.childNodes.length) {
    elm.removeChild(elm.firstChild);
  }
  elm.setAttribute('contenteditable', 'true');

  blockElements(nodes, elm);
};
