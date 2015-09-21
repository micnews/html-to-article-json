'use strict';

module.exports = function (tree) {
  if (tree.length === 0) {
    tree.push({
      type: 'paragraph',
      children: []
    });
  }

  for (var i = 0; i < tree.length; i++) {
    if (tree[i].children && hasNoContentNodes(tree[i])) {
      tree[i].children.unshift({
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
