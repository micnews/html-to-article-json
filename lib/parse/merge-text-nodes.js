'use stirct';

module.exports = function mergeTextNodes (tree) {
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
};

function sameTypeTextNodes (a, b) {
  return a.bold === b.bold &&
    a.href === b.href &&
    a.italic === b.italic;
}
