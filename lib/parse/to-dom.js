import domStyleParser from 'dom-style-parser';
import find from 'lodash.find';
import parse5 from 'parse5';

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
    const obj = find(elm.attrs, attr => {
      return attr.name === key;
    });

    return obj && obj.value;
  };
  const style = getAttribute('style');
  const children = visit(childNodes);

  return {
    nodeName: nodeName.toLowerCase(),
    tagName: tagName.toLowerCase(),
    getAttribute,
    style: style ? domStyleParser(style) : {},
    getElementsByTagName: tagName => getElementsByTagName(children, tagName, []),
    childNodes: children
  };
});

export default html => visit(parse5.parseFragment(html).childNodes);
