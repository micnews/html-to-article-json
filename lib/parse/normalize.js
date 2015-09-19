'use strict';

var mergeTextNodes = require('./merge-text-nodes');
var flattenTree = require('./flatten-tree');
var handleWhitespace = require('./handle-whitespace');

module.exports = function (input) {
  var tree = flattenTree(input);
  mergeTextNodes(tree);
  handleWhitespace(tree);
  minimumContent(tree);
  return tree;
};

function minimumContent (tree) {
  if (tree.length === 0) {
    tree.push({
      type: 'paragraph',
      children: []
    });
  }

  if (tree.length === 1) {
    if (hasNoContentNodes(tree[0])) {
      tree[0].children.unshift({
        type: 'linebreak'
      });
    }
  }
}

function hasNoContentNodes (textContainer) {
  return textContainer.children.every(function (child) {
    return child.type !== 'text' && child.type !== 'linebreak';
  });
}
