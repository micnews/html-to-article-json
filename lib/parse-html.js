'use strict';

var buildSimpleTree = require('./build-simple-tree');

module.exports = function (elm) {
  var tree = buildSimpleTree(elm);
  tree = flattenTree(tree);
  tree = mergeTextNodes(tree);
  return tree;
};

function flattenTree (tree) {
  var result = [];
  _flattenTree(tree, result);
  return result;
}

function _flattenTree (tree, result) {
  var texts;

  tree.forEach(function (child) {
    if (child.type === 'text') {
      if (texts) {
        texts.push(child);
      } else {
        texts = [child];
      }
    } else {
      if (texts) {
        result.push({
          type: 'paragraph',
          children: texts
        });
        texts = null;
      }

      if (child.type === 'div') {
        _flattenTree(child.children, result);
      } else {
        result.push({
          type: child.type,
          children: collectTexts(child.children)
        });
      }
    }
  });

  if (texts) {
    result.push({
      type: 'paragraph',
      children: texts
    });
  }
}

function collectTexts (list) {
  var result = [];
  _collectTexts(list, result);
  return result;
}

function _collectTexts (list, result) {
  list.forEach(function (obj) {
    if (obj.type === 'text') {
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

      node.children = mergeTextNodes(node.children);
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
