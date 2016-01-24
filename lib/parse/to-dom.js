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
  if (!elm.tagName) {
    return elm;
  }

  const getAttribute = key => {
    const obj = find(elm.attrs, attr => {
      return attr.name === key;
    });

    return obj && obj.value;
  };
  const style = getAttribute('style');
  const childNodes = visit(elm.childNodes);

  return {
    nodeName: elm.nodeName,
    tagName: elm.tagName,
    getAttribute,
    style: style ? domStyleParser(style) : {},
    getElementsByTagName: tagName => getElementsByTagName(childNodes, tagName, []),
    childNodes
  };
});

export default html => visit(parse5.parseFragment(html).childNodes);
