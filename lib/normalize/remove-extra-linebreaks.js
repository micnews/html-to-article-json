const shouldRemoveLinebreak = children => {
  return children[children.length - 1].type === 'linebreak' &&
    children[children.length - 2] &&
    children[children.length - 2].type !== 'linebreak';
};

export default tree => {
  tree.forEach(row => {
    if (row.children && shouldRemoveLinebreak(row.children)) {
      row.children = row.children.slice(0, -1);
    }
  });
};
