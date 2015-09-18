'use strict';

var buildSimpleTree = require('./build-simple-tree');
var mergeTextNodes = require('./merge-text-nodes');
var flattenTree = require('./flatten-tree');
var handleWhitespace = require('./handle-whitespace');

module.exports = function (elm) {
  var tree = buildSimpleTree(elm);
  tree = flattenTree(tree);
  tree = mergeTextNodes(tree);
  handleWhitespace(tree);
  return tree;
};
