import getTextFormattings from '../text-formattings';
import generateFunction from 'generate-function';

const mergeTextNodes = (sameTypeTextNodes, tree) => {
  let textNode;
  const merged = [];

  tree.forEach(node => {
    if (node.type === 'text') {
      if (textNode) {
        if (sameTypeTextNodes(textNode, node) && !textNode.mark && !node.mark) {
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
};

const createSameTypeTextNodes = textFormattings => {
  let fn = generateFunction();
  fn = fn('function (nodeA, nodeB) {');

  fn = fn('return ' + textFormattings
    .map(row => {
      return row.property;
    })
    .filter(property => {
      return property !== 'content';
    })
    .map(property => {
      return 'nodeA[\'' + property + '\'] === nodeB[\'' + property + '\']';
    })
    .join('&&'));

  fn = fn('}');
  return fn.toFunction();
};

export default opts => {
  const textFormattings = getTextFormattings(opts);
  const sameTypeTextNodes = createSameTypeTextNodes(textFormattings);

  return tree => {
    tree.forEach(node => {
      if (node.children) {
        node.children = mergeTextNodes(sameTypeTextNodes, node.children);
      }
    });
  };
};
