'use strict';

var blockElements = require('./block-elements');
var IncrementalDom = require('incremental-dom');

var elementOpen = IncrementalDom.elementOpen;
var elementClose = IncrementalDom.elementClose;
var patch = IncrementalDom.patch;

module.exports = function (elm, data) {
  if (data.length === 0) {
    data[0] = {
      type: 'paragraph',
      children: [{
        type: 'linebreak'
      }]
    };
  }

  patch(elm, function () {
    elementOpen('div', null, ['contenteditable', 'true']);
    data.forEach(blockElements);
    elementClose('div');
  });
};
