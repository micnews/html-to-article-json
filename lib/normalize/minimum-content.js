const hasNoContentNodes = children => children.every(child => {
  return (child.mark && !child.content) || (child.type !== 'text' && child.type !== 'linebreak');
});

const assureMinimumContent = node => {
  if (node.children && hasNoContentNodes(node.children)) {
    node.children.unshift({
      type: 'linebreak'
    });
  }
};

const assureOneChild = tree => {
  if (tree.length === 0) {
    tree.push({
      type: 'paragraph',
      children: []
    });
  }
};

export default tree => {
  assureOneChild(tree);

  tree.forEach(node => {
    if (node.type === 'blockquote') {
      assureOneChild(node.children);

      node.children.forEach(assureMinimumContent);
    } else {
      assureMinimumContent(node);
    }
  });
};
