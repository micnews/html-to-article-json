'use strict';

module.exports = function (tree) {
  tree.forEach(function (row) {
    if (shouldRemoveLinebreak(row.children)) {
      row.children = row.children.slice(0, -1);
    }
  });
};

function shouldRemoveLinebreak (children) {
  children = children.filter(function (child) {
    return child.type !== 'selection-marker';
  });

  if (children[children.length - 1].type !== 'linebreak') {
    return false;
  }

  if (!children[children.length - 2]) {
    return false;
  }

  if (children[children.length - 2].type === 'linebreak') {
    return false;
  }

  return true;
}
