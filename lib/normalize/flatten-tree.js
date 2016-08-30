const rowHasContent = row => row.content && row.content.trim().length > 0;
const rowHasSize = row => row.type === 'linebreak' || rowHasContent(row);
const hasSize = inlineElements => inlineElements.some(rowHasSize);

const flattenTree = (tree, result = []) => {
  let inlineElements;

  tree.forEach(child => {
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

      if (child.type === 'blockquote') {
        result.push({
          type: 'blockquote',
          children: flattenTree(child.children)
        });
      } else if (child.type === 'block') {
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

export default flattenTree;
