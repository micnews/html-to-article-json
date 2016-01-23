import setupMergeTextNodes from './merge-text-nodes';
import flattenTree from './flatten-tree';
import handleWhitespace from './handle-whitespace';
import minimumContent from './minimum-content';
import removeExtraLinkebreaks from './remove-extra-linebreaks';

export default opts => {
  const mergeTextNodes = setupMergeTextNodes(opts);

  return input => {
    const tree = flattenTree(input);
    mergeTextNodes(tree);
    handleWhitespace(tree);
    minimumContent(tree);
    removeExtraLinkebreaks(tree);
    return tree;
  };
};
