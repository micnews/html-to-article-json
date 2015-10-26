const VNode = require('virtual-dom').VNode;
const VText = require('virtual-dom').VText;

module.exports = function (elm) {
  return new VNode(elm.tagName, getAttributes(elm), parse(elm.childNodes));
};

function parse (childNodes) {
  const result = [];
  for (let i = 0; i < childNodes.length; i++) {
    let child = childNodes[i];

    // ELEMENT_NODE
    if (child.nodeType === 1) {
      result.push(
        new VNode(
          child.tagName,
          {
            attributes: getAttributes(child)
          },
          parse(child.childNodes)
        )
      );
    }
    // TEXT_NODE
    if (child.nodeType === 3) {
      result.push(new VText(childNodes[i].nodeValue));
    }
  }
  return result;
}

function getAttributes (elm) {
  const obj = {};
  let attr;
  for (let i = 0; i < elm.attributes.length; i++) {
    attr = elm.attributes[i].name;
    obj[attr] = elm.getAttribute(attr);
  }
  return obj;
}
