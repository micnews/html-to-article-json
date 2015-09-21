'use strict';

var blockElements = require('./block-elements');
var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');

module.exports = function (elm, nodes) {
  while (elm.childNodes.length) {
    elm.removeChild(elm.firstChild);
  }
  elm.setAttribute('contenteditable', 'true');

  var tree = h('div', { contentEditable: true });
  var newTree = h('div', { contentEditable: true }, blockElements(nodes));
  patch(elm, diff(tree, newTree));
};
