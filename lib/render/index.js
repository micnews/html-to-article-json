'use strict';

var blockElements = require('./block-elements');
var VNode = require('virtual-dom').VNode;
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var toVdom = require('./to-vdom');
var cleanup = require('./cleanup');

module.exports = function (elm, nodes) {
  var rootContenteditable = elm.getAttribute('contenteditable') === 'true';
  var opts = {};
  if (rootContenteditable) {
    elm.contentEditable = 'true';
    elm.setAttribute('contenteditable', 'true');
    opts.contentEditable = 'true';
  }

  var tree = toVdom(elm);
  var newTree = new VNode('DIV', opts, blockElements(nodes));
  patch(elm, diff(tree, newTree));
  cleanup(elm);
};
