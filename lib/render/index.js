'use strict';

var blockElements = require('./block-elements');
var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var toVdom = require('./to-vdom');
var cleanup = require('./cleanup');

module.exports = function (elm, nodes) {
  elm.contentEditable = 'true';
  elm.setAttribute('contenteditable', 'true');

  var tree = toVdom(elm);
  var newTree = h('div', { contentEditable: true }, blockElements(nodes));
  patch(elm, diff(tree, newTree));
  cleanup(elm);
};
