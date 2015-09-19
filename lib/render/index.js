'use strict';

var blockElements = require('./block-elements');
var IncrementalDom = require('incremental-dom');

var elementOpen = IncrementalDom.elementOpen;
var elementClose = IncrementalDom.elementClose;
var patch = IncrementalDom.patch;

module.exports = function (elm, data) {
  patch(elm, function () {
    elementOpen('div', null, ['contenteditable', 'true']);
    data.forEach(blockElements);
    elementClose('div');
  });
};
