module.exports = function (tree) {
  if (tree.length === 0) {
    tree.push({
      type: 'paragraph',
      children: []
    });
  }

  tree.forEach(function (node) {
    if (node.children && hasNoContentNodes(node.children)) {
      node.children.unshift({
        type: 'linebreak'
      });
    }
  });
};

function hasNoContentNodes (children) {
  return children.every(function (child) {
    return child.type !== 'text' && child.type !== 'linebreak';
  });
}
