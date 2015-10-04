'use strict';

var setupMergeTextNodes = require('./merge-text-nodes');
var flattenTree = require('./flatten-tree');
var handleWhitespace = require('./handle-whitespace');
var minimumContent = require('./minimum-content');
var removeExtraLinkebreaks = require('./remove-extra-linebreaks');

module.exports = function (opts) {
  var mergeTextNodes = setupMergeTextNodes(opts);

  return function (input) {
    var tree = flattenTree(input);
    mergeTextNodes(tree);
    handleWhitespace(tree);
    minimumContent(tree);
    removeExtraLinkebreaks(tree);
    return tree;
  };
};
