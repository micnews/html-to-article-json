'use strict';

var mergeTextNodes = require('./merge-text-nodes');
var flattenTree = require('./flatten-tree');
var handleWhitespace = require('./handle-whitespace');

module.exports = function (input) {
  var tree = flattenTree(input);
  mergeTextNodes(tree);
  handleWhitespace(tree);
  return tree;
};
