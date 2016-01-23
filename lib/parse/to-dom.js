import domStyleParser from 'dom-style-parser';

import find from 'lodash.find';
import parse5 from 'parse5';

export default function (html) {
  const dom = parse5.parseFragment(html).childNodes;

  visit(dom);

  return dom;
}

function visit (children) {
  children.forEach(function (elm) {
    if (elm.tagName) {
      elm.getAttribute = (key) => {
        const obj = find(elm.attrs, function (attr) {
          return attr.name === key;
        });

        return obj && obj.value;
      };

      const style = elm.getAttribute('style');
      elm.style = style ? domStyleParser(style) : {};

      elm.getElementsByTagName = (tagName) => getElementsByTagName(elm.childNodes, tagName, []);

      visit(elm.childNodes);
    }
  });
}

function getElementsByTagName (children, tagName, result) {
  for (let i = 0; i < children.length; ++i) {
    let elm = children[i];
    if (elm.tagName === tagName) {
      result.push(elm);
    }
    if (elm.childNodes) {
      getElementsByTagName(elm.childNodes, tagName, result);
    }
  }
  return result;
}
