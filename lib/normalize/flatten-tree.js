'use strict';

module.exports = function flattenTree (tree) {
  var result = [];
  _flattenTree(tree, result);
  return result;
};

function _flattenTree (tree, result) {
  var inlineElements;

  tree.forEach(function (child) {
    if (child.type === 'text' || child.type === 'linebreak' || child.type === 'selection-marker') {
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
        _flattenTree(child.children, result);
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
}

function hasSize (inlineElements) {
  return inlineElements.some(function (row) {
    return row.type === 'linebreak' ||
      row.type === 'selection-marker' ||
      row.content.trim().length > 0;
  });
}
