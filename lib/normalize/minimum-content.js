'use strict';

module.exports = function (tree) {
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
};

function hasNoContentNodes (textContainer) {
  return textContainer.children.every(function (child) {
    return child.type !== 'text' && child.type !== 'linebreak';
  });
}
