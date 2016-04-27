const shouldRemoveLinebreak = children => {
  return children[children.length - 1].type === 'linebreak' &&
    children[children.length - 2] &&
    children[children.length - 2].type !== 'linebreak' &&
    !isEmptyMarkNode(children[children.length - 2]);
};

export default tree => {
  tree.forEach(row => {
    if (row.children && shouldRemoveLinebreak(row.children)) {
      row.children = row.children.slice(0, -1);
    }
  });
};

function isEmptyMarkNode (node) {
  return node.mark && !node.content;
}
