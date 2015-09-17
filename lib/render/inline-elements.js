'use strict';

var IncrementalDom = require('incremental-dom');
var elementOpen = IncrementalDom.elementOpen;
var elementClose = IncrementalDom.elementClose;
var elementVoid = IncrementalDom.elementVoid;
var text = IncrementalDom.text;

var methods = {
  linebreak: renderLinebreak,
  text: renderText
};

module.exports = function renderInline (obj) {
  return methods[obj.type] && methods[obj.type](obj);
};

function renderLinebreak (obj) {
  elementVoid('br');
}

function renderText (obj) {
  if (obj.type !== 'text') {
    return;
  }

  if (obj.bold) {
    elementOpen('b');
  }

  if (obj.italic) {
    elementOpen('i');
  }

  if (obj.href) {
    elementOpen('a', '', [ 'href', obj.href ]);
  }

  text(obj.content);

  if (obj.href) {
    elementClose('a');
  }

  if (obj.italic) {
    elementClose('i');
  }

  if (obj.bold) {
    elementClose('b');
  }
}
