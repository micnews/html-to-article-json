const hasNoContentNodes = children => children.every(child => {
  return child.type !== 'text' && child.type !== 'linebreak';
});

export default tree => {
  if (tree.length === 0) {
    tree.push({
      type: 'paragraph',
      children: []
    });
  }

  tree.forEach(node => {
    if (node.children && hasNoContentNodes(node.children)) {
      node.children.unshift({
        type: 'linebreak'
      });
    }
  });
};
