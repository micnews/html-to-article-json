'use strict';

var mergeTextNodes = require('./merge-text-nodes');
var flattenTree = require('./flatten-tree');
var handleWhitespace = require('./handle-whitespace');
var minimumContent = require('./minimum-content');

module.exports = function (input) {
  var tree = flattenTree(input);
  mergeTextNodes(tree);
  handleWhitespace(tree);
  minimumContent(tree);
  return tree;
};
