'use strict';

var buildSimpleTree = require('./build-simple-tree');

module.exports = function (elm) {
  var tree = buildSimpleTree(elm);
  tree = flattenTree(tree);
  tree = mergeTextNodes(tree);
  handleWhitespace(tree);
  return tree;
};

function flattenTree (tree) {
  var result = [];
  _flattenTree(tree, result);
  return result;
}

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
      } else if (child.type === 'linebreak') {
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

function handleWhitespace (tree) {
  tree.forEach(function (obj) {
    if (obj.type === 'text') {
      obj.content = normalizeWhitespace(obj.content);
    } else if (obj.children) {
      handleWhitespace(obj.children);
    }
  });
}

function normalizeWhitespace (content) {
  for (; content.indexOf('\t') !== -1; content = content.replace('\t', ' '));
  for (; content.indexOf('\n') !== -1; content = content.replace('\n', ' '));
  for (; content.indexOf('  ') !== -1; content = content.replace('  ', ' '));
  return content;
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
    if (obj.type === 'text' || obj.type === 'linebreak') {
      result.push(obj);
    } else {
      _collectTexts(obj.children, result);
    }
  });
}

function mergeTextNodes (tree) {
  var textNode;
  var merged = [];

  tree.forEach(function (node) {
    if (node.type === 'text') {
      if (textNode) {
        if (sameTypeTextNodes(textNode, node)) {
          textNode.content = textNode.content + node.content;
        } else {
          merged.push(textNode);
          textNode = node;
        }
      } else {
        textNode = node;
      }
    } else {
      if (textNode) {
        merged.push(textNode);
        textNode = null;
      }

      if (node.type !== 'linebreak') {
        node.children = mergeTextNodes(node.children);
      }
      merged.push(node);
    }
  });

  if (textNode) {
    merged.push(textNode);
  }
  return merged;
}

function sameTypeTextNodes (a, b) {
  return a.bold === b.bold &&
    a.href === b.href &&
    a.italic === b.italic;
}
