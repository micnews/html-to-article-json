const setupMergeTextNodes = require('./merge-text-nodes');
const flattenTree = require('./flatten-tree');
const handleWhitespace = require('./handle-whitespace');
const minimumContent = require('./minimum-content');
const removeExtraLinkebreaks = require('./remove-extra-linebreaks');

module.exports = function (opts) {
  const mergeTextNodes = setupMergeTextNodes(opts);

  return function (input) {
    const tree = flattenTree(input);
    mergeTextNodes(tree);
    handleWhitespace(tree);
    minimumContent(tree);
    removeExtraLinkebreaks(tree);
    return tree;
  };
};
