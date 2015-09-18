'use strict';

module.exports = function flattenTree (tree) {
  var result = [];
  _flattenTree(tree, result);
  return result;
};

function _flattenTree (tree, result) {
  var inlineElements;

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

      if (child.type === 'div') {
        _flattenTree(child.children, result);
      } else if (child.type === 'linebreak' || child.type === 'selection-marker') {
        result.push(child);
      } else {
        result.push({
          type: child.type,
          children: collectTexts(child.children)
        });
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
    return row.type === 'linebreak' || row.content.trim().length > 0;
  });
}

function collectTexts (list) {
  var result = [];
  _collectTexts(list, result);
  return result;
}

function _collectTexts (list, result) {
  list.forEach(function (obj) {
    if (obj.type === 'text' || obj.type === 'linebreak' || obj.type === 'selection-marker') {
      result.push(obj);
    } else {
      _collectTexts(obj.children, result);
    }
  });
}
