'use strict';

var IncrementalDom = require('incremental-dom');
var elementOpen = IncrementalDom.elementOpen;
var elementClose = IncrementalDom.elementClose;
var elementVoid = IncrementalDom.elementVoid;
var text = IncrementalDom.text;

var methods = {
  linebreak: renderLinebreak,
  text: renderText,
  'selection-marker': selectionMarker
};

module.exports = function renderInline (obj) {
  return methods[obj.type] && methods[obj.type](obj);
};

function selectionMarker (obj) {
  var className = 'selection-marker-' + (obj.start ? 'start' : 'end');
  elementVoid('span', '', ['class', className]);
}

function renderLinebreak (obj) {
  elementVoid('br');
}

function renderText (obj) {
  if (obj.type !== 'text') {
    return;
  }

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
}
