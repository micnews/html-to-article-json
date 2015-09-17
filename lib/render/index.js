'use strict';

var blockElements = require('./block-elements');
var IncrementalDom = require('incremental-dom');

var elementOpen = IncrementalDom.elementOpen;
var elementClose = IncrementalDom.elementClose;

module.exports = function (data) {
  if (data.length === 0) {
    data[0] = {
      type: 'paragraph',
      children: [{
        type: 'linebreak'
      }]
    };
  }

  elementOpen('div', null, ['contenteditable', 'true']);
  data.forEach(blockElements);
  elementClose('div');
};
