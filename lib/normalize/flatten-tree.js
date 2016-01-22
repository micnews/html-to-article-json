module.exports = function flattenTree (tree, result) {
  result = result || [];
  let inlineElements;

  tree.forEach(function (child) {
    if (child.type === 'text' || child.type === 'linebreak') {
      if (inlineElements) {
        inlineElements.push(child);
      } else {
        inlineElements = [child];
      }
    } else {
      if (inlineElements && hasSize(inlineElements)) {
        result.push({
          type: 'paragraph',
          children: inlineElements
        });
        inlineElements = null;
      }

      if (child.type === 'block') {
        flattenTree(child.children, result);
      } else {
        result.push(child);
      }
    }
  });

  if (inlineElements && hasSize(inlineElements)) {
    result.push({
      type: 'paragraph',
      children: inlineElements
    });
  }
  return result;
};

function hasSize (inlineElements) {
  return inlineElements.some(function (row) {
    return row.type === 'linebreak' ||
      row.content.trim().length > 0;
  });
}
