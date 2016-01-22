module.exports = function (tree) {
  tree.forEach(function (row) {
    if (row.children && shouldRemoveLinebreak(row.children)) {
      row.children = row.children.slice(0, -1);
    }
  });
};

function shouldRemoveLinebreak (children) {
  children = children.filter(function (child) {
    return child.type !== 'selection-marker';
  });

  return children[children.length - 1].type === 'linebreak' &&
    children[children.length - 2] &&
    children[children.length - 2].type !== 'linebreak';
}
