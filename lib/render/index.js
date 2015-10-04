'use strict';

var setupBlockElements = require('./block-elements');
var VNode = require('virtual-dom').VNode;
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var toVdom = require('./to-vdom');

module.exports = function (opts) {
  return function (elm, nodes) {
    var blockElements = setupBlockElements(opts);
    var rootContenteditable = elm.getAttribute('contenteditable') === 'true';
    var divOpts = {};
    if (rootContenteditable) {
      elm.contentEditable = 'true';
      elm.setAttribute('contenteditable', 'true');
      divOpts.contentEditable = 'true';
    }

    var tree = toVdom(elm);
    var newTree = new VNode('DIV', divOpts, blockElements(nodes, opts));
    patch(elm, diff(tree, newTree));
  };
};
