import domStyleParser from 'dom-style-parser';
import find from 'lodash.find';
import parse5 from 'parse5';
import Set from 'es6-set';

const getElementsByTagName = (children, tagName, result) => {
  children.forEach(elm => {
    if (elm.tagName === tagName) {
      result.push(elm);
    }

    if (elm.childNodes) {
      getElementsByTagName(elm.childNodes, tagName, result);
    }
  });

  return result;
};

const visit = children => children.map(elm => {
  const { tagName, nodeName, attrs, childNodes } = elm;
  if (!tagName) {
    return elm;
  }

  const getAttribute = key => {
    const obj = find(attrs, attr => {
      return attr.name === key;
    });

    return obj && obj.value;
  };
  const hasAttribute = key => {
    return attrs.some(attr => {
      return attr.name === key;
    });
  };
  const style = getAttribute('style');
  const children = visit(childNodes);
  const classes = new Set((getAttribute('class') || '').split(' '));

  return {
    nodeName: nodeName.toLowerCase(),
    tagName: tagName.toLowerCase(),
    getAttribute, hasAttribute,
    classList: {
      contains (className) {
        return classes.has(className);
      }
    },
    style: style ? domStyleParser(style) : {},
    getElementsByTagName: tagName => getElementsByTagName(children, tagName, []),
    childNodes: children
  };
});

export default html => visit(parse5.parseFragment(html).childNodes);
