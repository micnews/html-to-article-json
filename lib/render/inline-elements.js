'use strict';

var IncrementalDom = require('incremental-dom');
var elementVoid = IncrementalDom.elementVoid;
var renderText = require('./render-text');

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
