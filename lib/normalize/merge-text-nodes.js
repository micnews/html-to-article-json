'use stirct';

module.exports = function (tree) {
  tree.forEach(function (node) {
    node.children = mergeTextNodes(node.children);
  });
};

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
