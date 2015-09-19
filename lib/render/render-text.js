'use strict';

var IncrementalDom = require('incremental-dom');
var elementOpen = IncrementalDom.elementOpen;
var elementClose = IncrementalDom.elementClose;
var text = IncrementalDom.text;

module.exports = function renderText (obj) {
  if (obj.bold) {
    elementOpen('strong');
  }

  if (obj.italic) {
    elementOpen('em');
  }

  if (obj.href) {
    elementOpen('a', '', [ 'href', obj.href ]);
  }

  text(obj.content);

  if (obj.href) {
    elementClose('a');
  }

  if (obj.italic) {
    elementClose('em');
  }

  if (obj.bold) {
    elementClose('strong');
  }
};
